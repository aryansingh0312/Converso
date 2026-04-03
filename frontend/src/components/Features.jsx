const FEATURES = [
  {
    icon: <ZapIcon />,
    title: "Real-time messaging",
    desc: "Messages delivered in under 50ms. No lag, no delays — just instant conversations that feel alive.",
    color: "from-indigo-500 to-violet-500",
    glow: "rgba(99,102,241,0.3)",
  },
  {
    icon: <LockIcon />,
    title: "End-to-end encryption",
    desc: "Every message, file, and call is protected with AES-256 encryption. Your privacy, guaranteed.",
    color: "from-violet-500 to-pink-500",
    glow: "rgba(139,92,246,0.3)",
  },
  {
    icon: <UsersIcon />,
    title: "Group chats & channels",
    desc: "Create groups of up to 1,000 members, with threads, reactions, polls, and shared file spaces.",
    color: "from-pink-500 to-rose-500",
    glow: "rgba(236,72,153,0.3)",
  },
  {
    icon: <BotIcon />,
    title: "AI assistant built-in",
    desc: "Summarise long threads, translate messages, draft replies, and get smart suggestions — all inline.",
    color: "from-cyan-500 to-indigo-500",
    glow: "rgba(6,182,212,0.3)",
  },
  {
    icon: <VideoIcon />,
    title: "HD video & voice calls",
    desc: "Crystal-clear 1-on-1 and group calls with screen sharing, noise cancellation, and in-call chat.",
    color: "from-emerald-500 to-cyan-500",
    glow: "rgba(16,185,129,0.3)",
  },
  {
    icon: <SmartphoneIcon />,
    title: "Works everywhere",
    desc: "Native apps for iOS, Android, macOS, and Windows. Your chats are synced in real-time across all devices.",
    color: "from-amber-500 to-orange-500",
    glow: "rgba(245,158,11,0.3)",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-28 px-6 overflow-hidden">
      {/* Subtle background orb */}
      <div className="absolute w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none bg-[radial-gradient(circle,rgba(99,102,241,0.1)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-[1] max-w-[1180px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(99,102,241,0.12)] border border-[rgba(99,102,241,0.25)] text-[#a5b4fc] text-xs font-semibold tracking-widest uppercase">
            Everything you need
          </span>
          <h2 className="font-heading text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-[#f0f0ff] tracking-[-0.02em] leading-[1.2]">
            Built for the way<br />
            <span className="bg-gradient-to-r from-[#818cf8] to-[#a78bfa] bg-clip-text text-transparent">teams actually communicate</span>
          </h2>
          <p className="text-[rgba(200,210,240,0.6)] text-[1rem] leading-[1.7] max-w-[50ch]">
            Every feature is designed to reduce friction and keep your team in flow — not drowning in notifications.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon, title, desc, color, glow }) => (
            <div
              key={title}
              className="group relative rounded-2xl p-6 bg-[rgba(18,18,38,0.8)] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{ "--glow": glow }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${glow}, transparent 65%)` }}
              />

              {/* Icon */}
              <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 text-white shadow-lg`}
                style={{ boxShadow: `0 6px 20px ${glow}` }}>
                <span className="w-5 h-5">{icon}</span>
              </div>

              <h3 className="relative font-heading text-[1rem] font-semibold text-[#e0e0f8] mb-2">{title}</h3>
              <p className="relative text-[0.875rem] text-[rgba(200,210,240,0.55)] leading-[1.65]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ZapIcon() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>; }
function LockIcon() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }
function UsersIcon() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function BotIcon() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V3M8 11V7M16 11V7M3 15h2M19 15h2"/><circle cx="9" cy="16" r="1" fill="currentColor"/><circle cx="15" cy="16" r="1" fill="currentColor"/></svg>; }
function VideoIcon() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>; }
function SmartphoneIcon() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>; }
