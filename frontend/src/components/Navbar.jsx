import { useState, useEffect } from "react";
import Button from "./Button";

const NAV_LINKS = [
  { id: "nav-features",    label: "Features",     href: "#features" },
  { id: "nav-howitworks",  label: "How it works", href: "#how-it-works" },
  { id: "nav-testimonials",label: "Testimonials",  href: "#testimonials" },
];

export default function Navbar({ onGetStarted }) {
  const [scrolled,    setScrolled]   = useState(false);
  const [mobileOpen,  setMobile]     = useState(false);

  /* Elevate navbar on scroll */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLink = (e, href) => {
    e.preventDefault();
    setMobile(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`sticky top-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(9,9,15,0.85)] backdrop-blur-[20px] backdrop-saturate-[160%] border-b border-white/[0.07] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-[1180px] mx-auto flex items-center h-16 px-6">

        {/* ── Brand ── */}
        <a href="/" id="nav-brand" className="group flex items-center gap-2.5 no-underline shrink-0 mr-10">
          <span className="flex w-8 h-8 drop-shadow-[0_0_8px_rgba(99,102,241,0.7)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]">
            <BubbleIcon />
          </span>
          <span className="font-heading text-[1.15rem] font-bold bg-gradient-to-br from-[#a78bfa] to-[#818cf8] bg-clip-text text-transparent tracking-[-0.02em]">
            Converso
          </span>
        </a>

        {/* ── Desktop links ── */}
        <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
          {NAV_LINKS.map(({ id, label, href }) => (
            <li key={id}>
              <a
                id={id}
                href={href}
                onClick={(e) => handleLink(e, href)}
                className="flex items-center px-3.5 py-2 rounded-lg text-[0.875rem] font-medium text-[rgba(200,210,240,0.6)] hover:text-[#e0e0f8] hover:bg-white/[0.06] transition-all duration-200 no-underline"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* ── Right controls ── */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Button
            id="nav-cta"
            variant="primary"
            size="sm"
            onClick={onGetStarted}
          >
            Try Converso →
          </Button>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          id="nav-mobile-menu"
          aria-label="Open menu"
          onClick={() => setMobile(v => !v)}
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10 border-none bg-transparent cursor-pointer p-0 ml-auto"
        >
          <span className={`block w-[22px] h-[2px] bg-white/70 rounded-full transition-all duration-300 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block w-[22px] h-[2px] bg-white/70 rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-[22px] h-[2px] bg-white/70 rounded-full transition-all duration-300 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div
          id="nav-drawer"
          className="md:hidden bg-[rgba(9,9,15,0.97)] backdrop-blur-[20px] border-t border-white/[0.06] px-4 py-4 flex flex-col gap-1 animate-drawer-in"
        >
          {NAV_LINKS.map(({ id, label, href }) => (
            <a
              key={id}
              href={href}
              onClick={(e) => handleLink(e, href)}
              className="flex items-center px-4 py-3 rounded-xl text-[0.9rem] font-medium text-[rgba(200,210,240,0.7)] hover:text-[#c4b5fd] hover:bg-[rgba(99,102,241,0.1)] transition-all duration-200 no-underline"
            >
              {label}
            </a>
          ))}

          <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/[0.06]">
            <button
              className="w-full py-3 rounded-xl text-sm font-medium text-[rgba(200,210,240,0.6)] border border-white/[0.1] bg-transparent cursor-pointer hover:text-white hover:border-white/20 transition-all"
              onClick={() => { setMobile(false); onGetStarted?.(); }}
            >
              Sign in
            </button>
            <Button
              id="nav-mobile-cta"
              variant="primary"
              size="md"
              fullWidth
              onClick={() => { setMobile(false); onGetStarted?.(); }}
            >
              Try Converso →
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function BubbleIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
      <circle cx="16" cy="16" r="15" fill="url(#gnav)" />
      <path d="M8 12h16M8 17h10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 22l4 3v-3" fill="#fff" />
      <defs>
        <linearGradient id="gnav" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
