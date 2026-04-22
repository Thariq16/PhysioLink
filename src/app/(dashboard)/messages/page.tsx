"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Paperclip,
  SendHorizontal,
  Image as ImageIcon,
  FileText,
  MoreVertical,
  Check,
  CheckCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { format, subMinutes, subHours, subDays } from "date-fns";

/* ─────────────────────────── Types ─────────────────────────── */
interface Message {
  id: string;
  from: "physio" | "patient";
  text?: string;
  attachment?: { name: string; type: "image" | "doc"; url?: string };
  ts: Date;
  read: boolean;
}

interface Thread {
  id: string;
  patientName: string;
  initials: string;
  lastMessage: string;
  ts: Date;
  unread: number;
  online: boolean;
  messages: Message[];
}

/* ─────────────────────────── Mock data ─────────────────────── */
const now = new Date();

const THREADS: Thread[] = [
  {
    id: "t1", patientName: "Ravi Jayasuriya", initials: "RJ", online: true,
    lastMessage: "Sure, I'll do the quad stretches tonight.", ts: subMinutes(now, 4), unread: 2,
    messages: [
      { id: "m1", from: "physio",  text: "Hi Ravi, how is your knee feeling today?",              ts: subHours(now, 3),    read: true },
      { id: "m2", from: "patient", text: "Much better, the swelling is down a lot!",              ts: subHours(now, 2.5),  read: true },
      { id: "m3", from: "physio",  text: "Great to hear! Remember to keep doing the ice packs twice a day.", ts: subHours(now, 2), read: true },
      { id: "m4", from: "patient", text: "Yes, doing them morning and night.",                    ts: subHours(now, 1.5),  read: true },
      { id: "m5", from: "physio",  text: "Perfect. Also start the quad stretch exercises from today's plan.", ts: subMinutes(now, 30), read: true },
      { id: "m6", from: "patient", text: "Sure, I'll do the quad stretches tonight.",             ts: subMinutes(now, 4),  read: false },
    ],
  },
  {
    id: "t2", patientName: "Amara Perera", initials: "AP", online: false,
    lastMessage: "The pain is still at 4/10 when I bend forward.", ts: subHours(now, 1), unread: 1,
    messages: [
      { id: "m1", from: "physio",  text: "Amara, how is your back today? Did you do the core exercises?", ts: subHours(now, 5), read: true },
      { id: "m2", from: "patient", text: "I tried, but I had to stop halfway through the bird-dog.", ts: subHours(now, 4), read: true },
      { id: "m3", from: "physio",  text: "That's okay. Don't push too hard. What's your pain level?", ts: subHours(now, 3), read: true },
      { id: "m4", from: "patient", text: "The pain is still at 4/10 when I bend forward.",            ts: subHours(now, 1), read: false },
    ],
  },
  {
    id: "t3", patientName: "Dinesh Silva", initials: "DS", online: true,
    lastMessage: "Should I try the internal rotation today?", ts: subHours(now, 3), unread: 0,
    messages: [
      { id: "m1", from: "physio",  text: "Good morning Dinesh. Can you rate your shoulder pain today?", ts: subDays(now, 1), read: true },
      { id: "m2", from: "patient", text: "Morning! About 6/10. It's sore at end range.",                ts: subDays(now, 1), read: true },
      { id: "m3", from: "physio",  text: "Let's hold off on overhead movements for now.",               ts: subHours(now, 5), read: true },
      { id: "m4", from: "patient", text: "Should I try the internal rotation today?",                   ts: subHours(now, 3), read: true },
    ],
  },
  {
    id: "t4", patientName: "Priya Rathnayake", initials: "PR", online: false,
    lastMessage: "Attached my progress photo from yesterday.", ts: subDays(now, 1), unread: 0,
    messages: [
      { id: "m1", from: "patient", text: "Hi Doctor! My ankle is feeling much stronger.",               ts: subDays(now, 2), read: true },
      { id: "m2", from: "physio",  text: "Wonderful! Let's increase the resistance band level this week.", ts: subDays(now, 2), read: true },
      { id: "m3", from: "patient", text: "I'll give it a try.",                                         ts: subDays(now, 2), read: true },
      { id: "m4", from: "patient", text: "Attached my progress photo from yesterday.",
        attachment: { name: "ankle_progress.jpg", type: "image" }, ts: subDays(now, 1), read: true },
    ],
  },
  {
    id: "t5", patientName: "Kasun Bandara", initials: "KB", online: false,
    lastMessage: "I watched the exercise video you sent.", ts: subDays(now, 2), unread: 0,
    messages: [
      { id: "m1", from: "physio",  text: "Kasun, I have uploaded a new exercise video for your ACL rehab.", ts: subDays(now, 3), read: true },
      { id: "m2", from: "patient", text: "I watched the exercise video you sent.",                          ts: subDays(now, 2), read: true },
    ],
  },
];

function formatMsgTime(date: Date) {
  const diffH = (now.getTime() - date.getTime()) / 1000 / 3600;
  if (diffH < 24) return format(date, "HH:mm");
  if (diffH < 48) return "Yesterday";
  return format(date, "d MMM");
}

/* ─────────────────────────── Message Bubble ─────────────────── */
function MsgBubble({ msg }: { msg: Message }) {
  const isPhysio = msg.from === "physio";

  return (
    <div className={cn("flex gap-2 max-w-[82%]", isPhysio ? "ml-auto flex-row-reverse" : "")}>
      {/* Avatar */}
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 self-end",
        isPhysio ? "bg-[#0d9488] text-white" : "bg-[#ccfbf1] text-[#0f766e]"
      )}>
        {isPhysio ? "Dr" : "P"}
      </div>

      {/* Bubble */}
      <div>
        {msg.attachment ? (
          <div className={cn(
            "rounded-2xl border px-3 py-2.5 text-[13px]",
            isPhysio
              ? "bg-[#0d9488] text-white border-[#0d9488] rounded-br-sm"
              : "bg-white text-[#1e293b] border-[#e2e8f0] rounded-bl-sm"
          )}>
            <div className="flex items-center gap-2">
              {msg.attachment.type === "image"
                ? <ImageIcon className="w-4 h-4 opacity-70" />
                : <FileText className="w-4 h-4 opacity-70" />}
              <span className="font-medium text-[12px]">{msg.attachment.name}</span>
            </div>
            {msg.text && <p className="mt-1.5">{msg.text}</p>}
          </div>
        ) : (
          <div className={cn(
            "rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed",
            isPhysio
              ? "bg-[#0d9488] text-white rounded-br-sm"
              : "bg-white border border-[#e2e8f0] text-[#1e293b] rounded-bl-sm"
          )}>
            {msg.text}
          </div>
        )}

        {/* Timestamp + read receipt */}
        <div className={cn("flex items-center gap-1 mt-1", isPhysio ? "justify-end" : "")}>
          <span className="text-[10px] text-[#94a3b8]">{formatMsgTime(msg.ts)}</span>
          {isPhysio && (
            msg.read
              ? <CheckCheck className="w-3 h-3 text-[#0d9488]" />
              : <Check className="w-3 h-3 text-[#94a3b8]" />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Main Page ─────────────────────── */
export default function MessagesPage() {
  const [activeId, setActiveId] = useState("t1");
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [threads, setThreads] = useState(THREADS);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find((t) => t.id === activeId)!;

  // Auto-scroll to bottom when thread changes or new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, threads]);

  const filteredThreads = threads.filter((t) =>
    t.patientName.toLowerCase().includes(search.toLowerCase())
  );

  function sendMessage() {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      from: "physio",
      text: input.trim(),
      ts: new Date(),
      read: false,
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, messages: [...t.messages, newMsg], lastMessage: input.trim(), ts: new Date() }
          : t
      )
    );
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Mark thread as read — called when switching threads
  function markAsRead(id: string) {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, unread: 0, messages: t.messages.map((m) => ({ ...m, read: true })) }
          : t
      )
    );
  }

  const totalUnread = threads.reduce((s, t) => s + t.unread, 0);

  return (
    <div className="animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[28px] font-bold text-[#1e293b] leading-tight"
            style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
            Messages
          </h1>
          <p className="text-[14px] text-[#64748b] mt-0.5">
            {totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? "s" : ""}` : "All caught up"}
          </p>
        </div>
      </div>

      {/* ── Split pane ── */}
      <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden flex" style={{ height: "calc(100vh - 220px)", minHeight: "560px" }}>

        {/* ── Left: Thread list ── */}
        <div className="w-[280px] flex-shrink-0 border-r border-[#e2e8f0] flex flex-col">
          {/* Search */}
          <div className="p-3 border-b border-[#f1f5f9]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#e2e8f0] rounded-[8px] bg-[#f8fafc] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9488] transition-colors"
              />
            </div>
          </div>

          {/* Thread list */}
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => { setActiveId(thread.id); markAsRead(thread.id); }}
                className={cn(
                  "w-full flex items-start gap-3 px-3.5 py-3 text-left border-b border-[#f1f5f9] transition-colors cursor-pointer",
                  thread.id === activeId
                    ? "bg-[#f0fdf9] border-r-2 border-r-[#0d9488]"
                    : "hover:bg-[#f8fafc]"
                )}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-[#ccfbf1] text-[#0f766e] text-[12px] font-bold flex items-center justify-center">
                    {thread.initials}
                  </div>
                  {thread.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#16a34a] rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={cn(
                      "text-[13px] truncate",
                      thread.unread > 0 ? "font-bold text-[#1e293b]" : "font-medium text-[#1e293b]"
                    )}>
                      {thread.patientName}
                    </span>
                    <span className="text-[10px] text-[#94a3b8] flex-shrink-0 ml-2">
                      {formatMsgTime(thread.ts)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn(
                      "text-[12px] truncate leading-snug",
                      thread.unread > 0 ? "text-[#1e293b] font-medium" : "text-[#94a3b8]"
                    )}>
                      {thread.lastMessage}
                    </p>
                    {thread.unread > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0d9488] text-white text-[10px] font-bold flex items-center justify-center">
                        {thread.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Active conversation ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Convo header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#e2e8f0] bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#ccfbf1] text-[#0f766e] text-[12px] font-bold flex items-center justify-center">
                  {activeThread.initials}
                </div>
                {activeThread.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#16a34a] rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#1e293b]">{activeThread.patientName}</p>
                <p className="text-[11px] text-[#94a3b8]">
                  {activeThread.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="teal">Patient</Badge>
              <button className="w-8 h-8 rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] flex items-center justify-center transition-colors cursor-pointer">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f8fafc]">
            {activeThread.messages.map((msg) => (
              <MsgBubble key={msg.id} msg={msg} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Composer */}
          <div className="border-t border-[#e2e8f0] bg-white p-3 flex-shrink-0">
            <div className="flex items-end gap-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] px-3 py-2 focus-within:border-[#0d9488] transition-colors">
              {/* Attachment button */}
              <button className="flex-shrink-0 w-7 h-7 rounded-lg text-[#94a3b8] hover:text-[#0d9488] flex items-center justify-center transition-colors cursor-pointer mb-0.5">
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Textarea */}
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message…"
                className="flex-1 bg-transparent text-[13.5px] text-[#1e293b] placeholder:text-[#94a3b8] resize-none focus:outline-none leading-relaxed py-0.5"
                style={{ maxHeight: "120px" }}
              />

              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-[8px] flex items-center justify-center transition-all cursor-pointer mb-0.5",
                  input.trim()
                    ? "bg-[#0d9488] text-white hover:bg-[#0f766e]"
                    : "bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed"
                )}
              >
                <SendHorizontal className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-[#94a3b8] mt-1.5 px-1">Press Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </div>
  );
}
