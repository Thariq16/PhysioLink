import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PhysioLink — Physiotherapy Management Platform",
    template: "%s | PhysioLink",
  },
  description:
    "PhysioLink helps physiotherapists manage patients, appointments, exercise rehabilitation programs, and private communications — all in one place.",
  keywords: ["physiotherapy", "patient management", "exercise plans", "rehabilitation", "Sri Lanka"],
  authors: [{ name: "PhysioLink" }],
  creator: "PhysioLink",
  metadataBase: new URL("https://physiolink.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://physiolink.app",
    title: "PhysioLink — Physiotherapy Management Platform",
    description: "Your recovery, connected.",
    siteName: "PhysioLink",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body style={{ fontFamily: "var(--font-dm-sans, 'DM Sans', system-ui, sans-serif)" }}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
