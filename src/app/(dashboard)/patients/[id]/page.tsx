import { PatientDetailClient } from "./ClientPage";

// The mock patient IDs we know about in the application
export function generateStaticParams() {
  return [
    { id: "p1" },
    { id: "p2" },
    { id: "p3" },
    { id: "p4" },
    { id: "p5" },
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" }
  ];
}

export default function PatientDetailPage() {
  return <PatientDetailClient />;
}
