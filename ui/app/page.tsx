"use client";
import Dashboard from "@/components/dashboard";
import dynamic from "next/dynamic";

const SolanaDashboard = dynamic(() => import("@/components/dashboard"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <SolanaDashboard />
    </main>
  );
}
