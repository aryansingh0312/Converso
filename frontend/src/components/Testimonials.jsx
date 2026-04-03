const TESTIMONIALS = [
  {
    quote: "Converso replaced Slack for our 40-person team. It's faster, prettier, and the AI summaries save us hours every week.",
    name: "Jordan Lee",
    role: "CTO, Stackly",
    seed: "Jordan",
    stars: 5,
  },
  {
    quote: "The encryption gives us peace of mind for client conversations. Best decision we made this year.",
    name: "Priya Sharma",
    role: "Head of Security, NovaPay",
    seed: "Priya",
    stars: 5,
  },
  {
    quote: "Setup took three minutes. We were having group calls the same afternoon. Nothing else comes close.",
    name: "Marcus Webb",
    role: "Founder, Launchpad Studio",
    seed: "Marcus",
    stars: 5,
  },
  {
    quote: "The mobile app is buttery smooth. I can stay in the loop without opening a laptop.",
    name: "Aisha Müller",
    role: "Remote Engineer, Figment Labs",
    seed: "Aisha",
    stars: 5,
  },
  {
    quote: "We tried five platforms before Converso. This is the only one the whole team stuck with.",
    name: "Tom Nakashima",
    role: "Product Manager, Drift",
    seed: "Tom",
    stars: 5,
  },
  {
    quote: "The AI assistant drafted my weekly update in 30 seconds. I'll never write it manually again.",
    name: "Elena Rossi",
    role: "Marketing Lead, Luma",
    seed: "Elena",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-28 px-6 overflow-hidden">
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,transparent_70%)] bottom-0 right-0" />

      <div className="relative z-[1] max-w-[1180px] mx-auto flex flex-col gap-14">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(99,102,241,0.12)] border border-[rgba(99,102,241,0.25)] text-[#a5b4fc] text-xs font-semibold tracking-widest uppercase">
            Loved by teams
          </span>
          <h2 className="font-heading text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-[#f0f0ff] tracking-[-0.02em] leading-[1.2]">
            Don't just take<br />
            <span className="bg-gradient-to-r from-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">our word for it</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map(({ quote, name, role, seed, stars }) => (
            <div
              key={name}
              className="flex flex-col gap-4 p-6 rounded-2xl bg-[rgba(18,18,38,0.8)] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: stars }).map((_, i) => (
                  <span key={i} className="text-[#fbbf24] text-sm">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-[0.9rem] text-[rgba(200,210,240,0.7)] leading-[1.7] flex-1">
                "{quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                <img
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`}
                  alt={name}
                  className="w-9 h-9 rounded-full bg-[#1e1e3a] border border-[rgba(99,102,241,0.25)] shrink-0"
                />
                <div>
                  <p className="text-[0.83rem] font-semibold text-[#e0e0f8]">{name}</p>
                  <p className="text-[0.75rem] text-[rgba(200,210,240,0.45)]">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
