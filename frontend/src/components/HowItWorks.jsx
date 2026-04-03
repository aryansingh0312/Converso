const STEPS = [
  {
    step: "01",
    title: "Create your account",
    desc: "Sign up in seconds with your email or via Google / GitHub. No credit card required.",
    icon: <UserPlusIcon />,
  },
  {
    step: "02",
    title: "Invite your team",
    desc: "Share a link or send email invites. Your team joins with one click — zero setup needed.",
    icon: <SendIcon />,
  },
  {
    step: "03",
    title: "Start chatting",
    desc: "Create channels, start DMs, jump on a call. Your workspace is ready instantly.",
    icon: <MessageIcon />,
  },
];

const STATS = [
  { value: "12K+",  label: "Active users" },
  { value: "<50ms", label: "Message latency" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "128bit", label: "Encryption" },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 px-6 overflow-hidden">
      {/* Divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-[rgba(99,102,241,0.4)]" />

      <div className="max-w-[1180px] mx-auto flex flex-col gap-24">

        {/* Steps */}
        <div className="flex flex-col items-center gap-14">
          <div className="text-center flex flex-col items-center gap-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(99,102,241,0.12)] border border-[rgba(99,102,241,0.25)] text-[#a5b4fc] text-xs font-semibold tracking-widest uppercase">
              Get started in minutes
            </span>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-[#f0f0ff] tracking-[-0.02em] leading-[1.2]">
              Up and running<br />
              <span className="bg-gradient-to-r from-[#818cf8] to-[#ec4899] bg-clip-text text-transparent">in three steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-[rgba(99,102,241,0.4)] via-[rgba(139,92,246,0.4)] to-[rgba(236,72,153,0.4)]" />

            {STEPS.map(({ step, title, desc, icon }, i) => (
              <div key={step} className="relative flex flex-col items-center text-center gap-5">
                {/* Step circle */}
                <div className="relative w-20 h-20 rounded-full bg-[rgba(18,18,38,0.9)] border-2 border-[rgba(99,102,241,0.35)] flex items-center justify-center z-[1] shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  <span className="w-7 h-7 text-[#a78bfa]">{icon}</span>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-[0.65rem] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-[1rem] font-semibold text-[#e0e0f8]">{title}</h3>
                  <p className="text-[0.875rem] text-[rgba(200,210,240,0.55)] leading-[1.65] max-w-[26ch] mx-auto">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 py-6 px-4 rounded-2xl bg-[rgba(18,18,38,0.6)] border border-white/[0.06] text-center"
            >
              <span className="font-heading text-3xl font-extrabold bg-gradient-to-br from-[#818cf8] to-[#a78bfa] bg-clip-text text-transparent">
                {value}
              </span>
              <span className="text-[0.8rem] text-[rgba(200,210,240,0.5)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UserPlusIcon() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>; }
function SendIcon() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>; }
function MessageIcon() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
