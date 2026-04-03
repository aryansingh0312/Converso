import { useState, useEffect } from "react";
import Button from "./Button";

const TYPING_WORDS = ["instantly.", "securely.", "beautifully.", "together."];
const PROOF_AVATARS = ["Sam", "Lily", "Raj", "Zoe", "Mike"];
const MESSAGES = [
  { side: "left",  text: "Hey! Did you see the new design? 🎨" },
  { side: "right", text: "Yes! It looks absolutely stunning 🔥" },
  { side: "left",  text: "Right? The animations are so smooth!" },
  { side: "right", text: "Let's ship it today 🚀" },
];

export default function Hero({ onGetStarted }) {
  const [wordIdx, setWordIdx]     = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting]   = useState(false);

  useEffect(() => {
    const word = TYPING_WORDS[wordIdx];
    let t;
    if (!deleting && displayed.length < word.length)
      t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 90);
    else if (!deleting && displayed.length === word.length)
      t = setTimeout(() => setDeleting(true), 1800);
    else if (deleting && displayed.length > 0)
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    else { setDeleting(false); setWordIdx(i => (i + 1) % TYPING_WORDS.length); }
    return () => clearTimeout(t);
  }, [displayed, deleting, wordIdx]);

  return (
    <section id="hero" className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden px-6 py-20">

      {/* Orbs */}
      <div className="absolute w-[560px] h-[560px] rounded-full blur-[80px] pointer-events-none bg-[radial-gradient(circle,rgba(99,102,241,0.28)_0%,transparent_70%)] -top-[120px] -left-[140px] animate-orb-1" />
      <div className="absolute w-[480px] h-[480px] rounded-full blur-[80px] pointer-events-none bg-[radial-gradient(circle,rgba(139,92,246,0.22)_0%,transparent_70%)] -bottom-[80px] -right-[100px] animate-orb-2" />
      <div className="absolute w-[300px] h-[300px] rounded-full blur-[80px] pointer-events-none bg-[radial-gradient(circle,rgba(236,72,153,0.14)_0%,transparent_70%)] top-[40%] left-[50%] animate-orb-3" />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none [background-image:linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,black_40%,transparent_100%)]" />

      {/* Two-column layout */}
      <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-2 items-center gap-16 max-w-[1180px] w-full mx-auto">

        {/* ── Left copy ── */}
        <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">

          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-[0.9rem] py-[0.35rem] rounded-full bg-[rgba(99,102,241,0.12)] border border-[rgba(99,102,241,0.3)] text-[#a5b4fc] text-[0.78rem] font-semibold tracking-[0.04em]">
            <span className="w-[7px] h-[7px] rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.8)] animate-badge-pulse" />
            Now in public beta
          </span>

          {/* Headline */}
          <h1 className="font-heading text-[clamp(2.2rem,4.5vw,3.6rem)] font-extrabold leading-[1.15] text-[#f0f0ff] tracking-[-0.03em]">
            Connect with anyone,{" "}
            <span className="relative whitespace-nowrap">
              <span className="bg-gradient-to-br from-[#818cf8] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">
                {displayed}
              </span>
              <span className="inline-block w-[3px] h-[0.85em] bg-[#818cf8] ml-[3px] rounded-sm align-middle animate-cursor-blink" />
            </span>
          </h1>

          {/* Sub */}
          <p className="text-[1.05rem] leading-[1.7] text-[rgba(200,210,240,0.65)] max-w-[48ch]">
            Converso brings your conversations to life with real-time messaging,
            smart groups, encrypted calls — all in one
            beautiful place.
          </p>

          {/* CTA */}
          <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
            <Button id="hero-cta-primary" variant="primary" size="lg" iconRight={<ArrowIcon />} onClick={onGetStarted}>
              Try Converso
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <div className="flex">
              {PROOF_AVATARS.map((seed, i) => (
                <img
                  key={seed}
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-[#09090f] bg-[#1e1e3a] -ml-2 first:ml-0"
                  style={{ zIndex: PROOF_AVATARS.length - i }}
                />
              ))}
            </div>
            <p className="text-[0.82rem] text-[rgba(200,210,240,0.6)]">
              <strong className="text-[#c4b5fd]">12,000+</strong> people chatting right now
            </p>
          </div>
        </div>

        {/* ── Right visual ── */}
        <div className="relative hidden lg:flex items-center justify-center">

          {/* Chat card */}
          <div className="w-[340px] rounded-[20px] bg-[rgba(18,18,38,0.9)] border border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(99,102,241,0.12)] backdrop-blur-xl overflow-hidden animate-card-float">

            {/* Header */}
            <div className="flex items-center gap-[0.65rem] px-[1.1rem] py-4 border-b border-white/[0.06] bg-white/[0.03]">
              <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Alex" alt="" className="w-[38px] h-[38px] rounded-full bg-[#1e1e3a] border-2 border-[rgba(99,102,241,0.4)] shrink-0" />
              <div>
                <p className="font-heading text-[0.88rem] font-semibold text-[#e0e0f8]">Alex Chen</p>
                <p className="flex items-center gap-[0.3rem] text-[0.72rem] text-[rgba(200,210,240,0.5)]">
                  <span className="w-[7px] h-[7px] rounded-full bg-[#22c55e] shadow-[0_0_5px_rgba(34,197,94,0.7)]" />
                  Online
                </p>
              </div>
              <div className="ml-auto flex gap-[0.6rem] text-[rgba(200,210,240,0.5)]">
                <CallIconSm /> <VideoIconSm />
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-[0.55rem] p-[1.1rem]">
              {MESSAGES.map((msg, i) => (
                <div
                  key={i}
                  style={{ animationDelay: `${i * 0.18}s` }}
                  className={`max-w-[80%] px-[0.85rem] py-[0.55rem] rounded-[14px] text-[0.82rem] leading-[1.45] animate-msg-pop
                    ${msg.side === "left"
                      ? "self-start bg-[rgba(99,102,241,0.12)] border border-[rgba(99,102,241,0.18)] text-[#d0d8f8] rounded-bl-[4px]"
                      : "self-end bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-br-[4px] shadow-[0_4px_14px_rgba(99,102,241,0.35)]"
                    }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-[0.65rem] px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
              <span className="flex-1 text-[0.8rem] text-[rgba(180,190,230,0.3)]">Type a message…</span>
              <button className="w-8 h-8 rounded-full border-none bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(99,102,241,0.4)]">
                <SendIcon />
              </button>
            </div>
          </div>

          {/* Notification pill */}
          <div className="absolute -top-7 -right-8 flex items-center gap-[0.6rem] px-[0.9rem] py-[0.55rem] rounded-[14px] bg-[rgba(20,20,40,0.95)] border border-white/10 shadow-[0_8px_28px_rgba(0,0,0,0.4)] backdrop-blur-2xl w-[210px] animate-notif-float">
            <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Maya" alt="" className="w-[30px] h-[30px] rounded-full bg-[#1e1e3a] shrink-0" />
            <div>
              <p className="text-[0.74rem] font-bold text-[#e0e0f8]">Maya</p>
              <p className="text-[0.7rem] text-[rgba(200,210,240,0.55)]">Sent you a photo 📸</p>
            </div>
            <span className="ml-auto text-[0.68rem] text-[#818cf8] font-semibold shrink-0">now</span>
          </div>

          {/* Stats pill */}
          <div className="absolute -bottom-6 -left-9 flex items-center gap-[0.55rem] px-[0.9rem] py-2 rounded-xl bg-[rgba(20,20,40,0.95)] border border-white/10 shadow-[0_8px_28px_rgba(0,0,0,0.4)] backdrop-blur-2xl text-[0.75rem] text-[rgba(200,210,240,0.7)] whitespace-nowrap animate-stat-float">
            <span className="text-base">⚡</span>
            <span>Delivered in <strong className="text-[#a78bfa]">&lt;50ms</strong></span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center" aria-label="Scroll down">
        <span className="block w-[22px] h-9 border-2 border-white/20 rounded-xl relative">
          <span className="absolute left-1/2 -translate-x-1/2 w-1 h-2 bg-white/40 rounded-full animate-scroll-bob" />
        </span>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return <svg className="w-[1em] h-[1em]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}
function PlayIcon() {
  return <svg className="w-[1em] h-[1em]" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.1)" /><polygon points="10,8 16,12 10,16" /></svg>;
}
function SendIcon() {
  return <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
}
function CallIconSm() {
  return <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.09a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
function VideoIconSm() {
  return <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
}
