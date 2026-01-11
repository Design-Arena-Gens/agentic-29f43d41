import { AgentDashboard } from "@/components/AgentDashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-indigo-50 px-4 py-10 font-sans text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-indigo-950/30 dark:text-zinc-50 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <AgentDashboard />
      </div>
    </main>
  );
}
