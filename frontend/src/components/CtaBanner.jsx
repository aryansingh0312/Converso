import Button from "./Button";

export default function CtaBanner({ onGetStarted }) {
  return (
    <section id="cta" className="relative py-28 px-6 overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none bg-[radial-gradient(circle,rgba(99,102,241,0.22)_0%,transparent_70%)] -top-20 left-1/2 -translate-x-1/2" />

      <div className="relative z-[1] max-w-[900px] mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-br from-[rgba(99,102,241,0.15)] to-[rgba(139,92,246,0.08)] border border-[rgba(99,102,241,0.25)] p-12 md:p-16 text-center overflow-hidden">

          {/* Decorative corner dots */}
          <div className="absolute top-6 left-6 w-2 h-2 rounded-full bg-[rgba(99,102,241,0.5)]" />
          <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-[rgba(99,102,241,0.5)]" />
          <div className="absolute bottom-6 left-6 w-2 h-2 rounded-full bg-[rgba(99,102,241,0.5)]" />
          <div className="absolute bottom-6 right-6 w-2 h-2 rounded-full bg-[rgba(99,102,241,0.5)]" />

          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none [background-image:linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] [background-size:40px_40px] rounded-3xl" />

          <div className="relative flex flex-col items-center gap-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(99,102,241,0.15)] border border-[rgba(99,102,241,0.3)] text-[#a5b4fc] text-xs font-semibold tracking-widest uppercase">
              Free forever for small teams
            </span>

            <h2 className="font-heading text-[clamp(1.9rem,4vw,3rem)] font-extrabold text-[#f0f0ff] tracking-[-0.03em] leading-[1.15]">
              Ready to ditch the chaos?<br />
              <span className="bg-gradient-to-r from-[#818cf8] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">
                Start for free today.
              </span>
            </h2>

            <p className="text-[rgba(200,210,240,0.6)] text-[1rem] leading-[1.7] max-w-[46ch]">
              No credit card. No limits on messages. No hidden fees. Just fast, beautiful, encrypted conversations.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center mt-2">
              <Button
                id="cta-get-started"
                variant="primary"
                size="lg"
                onClick={onGetStarted}
                iconRight={<ArrowIcon />}
              >
                Try for free
              </Button>
              <p className="text-[0.8rem] text-[rgba(200,210,240,0.4)]">
                No credit card · Free for up to 10 users
              </p>
            </div>

            {/* Proof avatars */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex">
                {["Dan", "Mia", "Leo", "Kai", "Noa"].map((s, i) => (
                  <img
                    key={s}
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${s}`}
                    alt=""
                    className="w-7 h-7 rounded-full border-2 border-[rgba(15,15,30,0.8)] bg-[#1e1e3a] -ml-2 first:ml-0"
                    style={{ zIndex: 5 - i }}
                  />
                ))}
              </div>
              <p className="text-[0.78rem] text-[rgba(200,210,240,0.5)]">
                Join <strong className="text-[#c4b5fd]">12,000+</strong> happy users
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return <svg className="w-[1em] h-[1em]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
}
