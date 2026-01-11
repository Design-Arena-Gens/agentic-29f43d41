'use client';

import { useMemo, useState } from "react";
import {
  AgentInput,
  QuickActionResult,
  SocialPlatform,
  defaultAgentInput,
  generateQuickAction,
  generateStrategy,
} from "@/lib/agent";

const allPlatforms: SocialPlatform[] = ["Instagram", "TikTok", "LinkedIn", "Twitter/X", "YouTube", "Facebook"];

const cadenceOptions: AgentInput["cadence"][] = ["Daily", "3x Weekly", "Weekly"];

function InputLabel({ label, description }: { label: string; description?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{label}</span>
      {description ? <span className="text-xs text-zinc-500 dark:text-zinc-400">{description}</span> : null}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      </div>
      {children}
    </section>
  );
}

interface QuickActionButtonProps {
  label: string;
  action: "launch" | "post" | "respond";
  isActive: boolean;
  onClick: () => void;
}

function QuickActionButton({ label, action, isActive, onClick }: QuickActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-xl border px-4 py-3 text-left transition ${
        isActive
          ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300"
          : "border-zinc-200 text-zinc-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-600 dark:hover:text-indigo-300"
      }`}
      aria-pressed={isActive}
    >
      <div className="text-sm font-semibold uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{actionCopy[action]}</div>
    </button>
  );
}

const actionCopy: Record<"launch" | "post" | "respond", string> = {
  launch: "Plan a full-channel moment",
  post: "Draft a hero post instantly",
  respond: "Handle a high-intent reply",
};

function QuickActionPanel({ result }: { result: QuickActionResult }) {
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/80 p-4 text-sm text-indigo-800 shadow-sm dark:border-indigo-800/40 dark:bg-indigo-900/30 dark:text-indigo-100">
      <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">{result.title}</div>
      <p className="mt-2 leading-relaxed text-indigo-900/80 dark:text-indigo-100/90">{result.content}</p>
      <div className="mt-3 text-xs font-semibold text-indigo-500 dark:text-indigo-300">Micro-checklist</div>
      <ul className="mt-2 space-y-1 text-sm">
        {result.checklist.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex h-1.5 w-1.5 flex-none rounded-full bg-indigo-400 dark:bg-indigo-300" />
            <span className="text-indigo-900/80 dark:text-indigo-100/90">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AgentDashboard() {
  const [input, setInput] = useState<AgentInput>(defaultAgentInput);
  const [activeAction, setActiveAction] = useState<"launch" | "post" | "respond">("post");

  const strategy = useMemo(() => generateStrategy(input), [input]);
  const quickAction = useMemo(() => generateQuickAction(activeAction, input), [activeAction, input]);

  const updateField = <K extends keyof AgentInput>(key: K, value: AgentInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const togglePlatform = (platform: SocialPlatform) => {
    setInput((prev) => {
      const exists = prev.platforms.includes(platform);
      return {
        ...prev,
        platforms: exists ? prev.platforms.filter((p) => p !== platform) : [...prev.platforms, platform],
      };
    });
  };

  const handleListUpdate = (key: "keyOfferings" | "promotions" | "hashtags" | "upcomingMoments", value: string) => {
    updateField(
      key,
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <header className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-white via-white to-indigo-50 p-8 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-950 dark:to-indigo-950/30">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">Command Center</p>
            <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
              Social Media Operations Agent
            </h1>
            <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
              Feed the agent your brand DNA, then deploy a ready-to-run social engine: positioning, cadences, weekly content plan, and high-intent engagement scripts.
            </p>
          </div>
          <div className="rounded-2xl border border-indigo-200 bg-white/80 px-4 py-3 text-sm shadow dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-100">
            <div className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-200">Now Tracking</div>
            <div className="mt-1 font-semibold text-indigo-700 dark:text-indigo-100">
              {input.campaignGoal || "Define campaign goal"}
            </div>
            <div className="text-xs text-indigo-500/80 dark:text-indigo-200/70">
              Across {input.platforms.length || 3}+ platforms
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-10">
        <SectionCard title="Brand Inputs">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <InputLabel label="Brand name" />
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                value={input.brandName}
                onChange={(event) => updateField("brandName", event.target.value)}
              />
            </label>
            <label className="block">
              <InputLabel label="Mission" />
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                value={input.mission}
                onChange={(event) => updateField("mission", event.target.value)}
              />
            </label>
            <label className="block">
              <InputLabel label="Audience" description="Who are we speaking to?" />
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                value={input.audience}
                onChange={(event) => updateField("audience", event.target.value)}
              />
            </label>
            <label className="block">
              <InputLabel label="Tone of voice" />
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                value={input.tone}
                onChange={(event) => updateField("tone", event.target.value)}
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4">
            <label className="block">
              <InputLabel label="Key offerings" description="Comma separated" />
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                value={input.keyOfferings.join(", ")}
                onChange={(event) => handleListUpdate("keyOfferings", event.target.value)}
              />
            </label>
            <label className="block">
              <InputLabel label="Campaign goal" description="e.g. drive demos, launch course" />
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                value={input.campaignGoal}
                onChange={(event) => updateField("campaignGoal", event.target.value)}
              />
            </label>
            <label className="block">
              <InputLabel label="Promotions" description="Upcoming initiatives" />
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                value={input.promotions.join(", ")}
                onChange={(event) => handleListUpdate("promotions", event.target.value)}
              />
            </label>
            <label className="block">
              <InputLabel label="Hashtags" description="Preferred or branded tags" />
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                value={input.hashtags.join(", ")}
                onChange={(event) => handleListUpdate("hashtags", event.target.value)}
              />
            </label>
            <label className="block">
              <InputLabel label="Moments" description="Launches, events, collabs" />
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                value={input.upcomingMoments.join(", ")}
                onChange={(event) => handleListUpdate("upcomingMoments", event.target.value)}
              />
            </label>
          </div>
        </SectionCard>

        <SectionCard title="Channel Stack">
          <div className="space-y-4">
            <div>
              <InputLabel label="Active platforms" description="Toggle where the agent deploys content" />
              <div className="mt-3 flex flex-wrap gap-2">
                {allPlatforms.map((platform) => {
                  const isActive = input.platforms.includes(platform);
                  return (
                    <button
                      type="button"
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        isActive
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:border-indigo-400 dark:text-indigo-200"
                          : "border-zinc-200 text-zinc-500 hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-500 dark:hover:text-indigo-200"
                      }`}
                    >
                      {platform}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <InputLabel label="Cadence intensity" description="How often the agent publishes" />
              <div className="mt-3 grid grid-cols-3 gap-2">
                {cadenceOptions.map((cadence) => (
                  <button
                    key={cadence}
                    type="button"
                    onClick={() => updateField("cadence", cadence)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                      input.cadence === cadence
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:border-indigo-400 dark:text-indigo-200"
                        : "border-zinc-200 text-zinc-500 hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-500 dark:hover:text-indigo-200"
                    }`}
                  >
                    {cadence}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <SectionCard title="Agent Output">
          <div className="space-y-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">Mission headline</div>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{strategy.headline}</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{strategy.positioning}</p>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">Content pillars</div>
              <ul className="mt-2 space-y-2">
                {strategy.pillars.map((pillar) => (
                  <li
                    key={pillar}
                    className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-sm text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200"
                  >
                    {pillar}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">Cadence protocol</div>
              <div className="mt-2 grid gap-3 md:grid-cols-2">
                {strategy.cadences.map((cadence) => (
                  <div
                    key={cadence.channel}
                    className="rounded-xl border border-zinc-200 bg-white/90 p-3 text-sm shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-50">{cadence.channel}</div>
                      <div className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-300">Frequency</div>
                    </div>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{cadence.frequency}</p>
                    <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{cadence.focus}</div>
                    <div className="mt-2 text-xs font-semibold text-indigo-500 dark:text-indigo-300">{cadence.automation}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Weekly Run of Show">
          <div className="space-y-3">
            {strategy.weeklyCalendar.map((slot) => (
              <div
                key={`${slot.day}-${slot.platform}`}
                className="rounded-2xl border border-zinc-200 bg-white/90 p-3 text-sm shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{slot.day}</span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{slot.platform}</span>
                  </div>
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-400/20 dark:text-indigo-200">
                    {slot.format}
                  </span>
                </div>
                <div className="mt-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">{slot.theme}</div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{slot.talkingPoint}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">
                  Hook
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{slot.hook}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">
                  CTA
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{slot.cta}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-indigo-500 dark:text-indigo-300">
                  {slot.hashtags.map((tag) => (
                    <span key={tag} className="rounded-full bg-indigo-500/10 px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <SectionCard title="Engagement Plays">
          <div className="space-y-3">
            {strategy.engagementPlays.map((play) => (
              <div
                key={play.name}
                className="rounded-xl border border-zinc-200 bg-white/80 p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{play.name}</div>
                  <div className="rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
                    Trigger
                  </div>
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{play.trigger}</p>
                <p className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-300">{play.response}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Control Room">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">Quick actions</div>
              <div className="mt-2 flex flex-col gap-2 lg:flex-row">
                <QuickActionButton
                  label="Launch Play"
                  action="launch"
                  isActive={activeAction === "launch"}
                  onClick={() => setActiveAction("launch")}
                />
                <QuickActionButton
                  label="Hero Post"
                  action="post"
                  isActive={activeAction === "post"}
                  onClick={() => setActiveAction("post")}
                />
                <QuickActionButton
                  label="Reply Script"
                  action="respond"
                  isActive={activeAction === "respond"}
                  onClick={() => setActiveAction("respond")}
                />
              </div>
            </div>
            <QuickActionPanel result={quickAction} />

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">
                Metrics to monitor
              </div>
              <ul className="mt-2 space-y-2">
                {strategy.metrics.map((metric) => (
                  <li key={metric.name} className="rounded-xl border border-zinc-200 bg-white/90 p-3 text-sm shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-50">{metric.name}</div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">{metric.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

