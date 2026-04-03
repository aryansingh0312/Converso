const LINKS = {
  Product:  ["Features", "Pricing", "Changelog", "Roadmap", "Status"],
  Company:  ["About", "Blog", "Careers", "Press", "Contact"],
  Legal:    ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
  Support:  ["Help Center", "Community", "API Docs", "System Status"],
};

const SOCIALS = [
  { label: "Twitter / X", icon: <XIcon /> },
  { label: "GitHub",      icon: <GithubIcon /> },
  { label: "Discord",     icon: <DiscordIcon /> },
  { label: "LinkedIn",    icon: <LinkedInIcon /> },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[rgba(6,6,18,0.8)] pt-16 pb-8 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] rounded-full blur-[100px] pointer-events-none bg-[radial-gradient(circle,rgba(99,102,241,0.07)_0%,transparent_70%)]" />

      <div className="relative z-[1] max-w-[1180px] mx-auto flex flex-col gap-12">

        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <span className="flex w-8 h-8 drop-shadow-[0_0_8px_rgba(99,102,241,0.7)]">
                <BubbleIcon />
              </span>
              <span className="font-heading text-lg font-bold bg-gradient-to-br from-[#a78bfa] to-[#818cf8] bg-clip-text text-transparent">
                Converso
              </span>
            </div>

            <p className="text-[0.875rem] text-[rgba(200,210,240,0.5)] leading-[1.7] max-w-[32ch]">
              Fast, beautiful, encrypted messaging for modern teams. Free forever for small teams.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] text-[rgba(200,210,240,0.5)] hover:text-[#c4b5fd] hover:border-[rgba(99,102,241,0.35)] hover:bg-[rgba(99,102,241,0.08)] transition-all duration-200"
                >
                  <span className="w-[18px] h-[18px] flex items-center justify-center">{icon}</span>
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="flex gap-2 mt-1">
              <input
                id="footer-newsletter"
                type="email"
                placeholder="you@example.com"
                className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] text-[#e0e0f8] text-sm placeholder:text-[rgba(180,190,230,0.3)] outline-none focus:border-[rgba(99,102,241,0.5)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] transition-all caret-[#818cf8]"
              />
              <button
                id="footer-subscribe"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-sm font-semibold border-none cursor-pointer hover:shadow-[0_4px_14px_rgba(99,102,241,0.45)] transition-all duration-200 whitespace-nowrap"
              >
                Get Started
              </button>
            </div>
            <p className="text-[0.73rem] text-[rgba(200,210,240,0.35)]">Get product updates. No spam, ever.</p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-8 lg:col-span-3">
            {Object.entries(LINKS).map(([group, items]) => (
              <div key={group} className="flex flex-col gap-4">
                <p className="font-heading text-[0.78rem] font-semibold text-[#e0e0f8] uppercase tracking-widest">
                  {group}
                </p>
                <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                  {items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-[0.85rem] text-[rgba(200,210,240,0.5)] hover:text-[#c4b5fd] transition-colors duration-150 no-underline"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
          <p className="text-[0.78rem] text-[rgba(200,210,240,0.35)]">
            © {new Date().getFullYear()} Converso, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_5px_rgba(34,197,94,0.7)]" />
            <span className="text-[0.75rem] text-[rgba(200,210,240,0.4)]">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Icons ── */
function BubbleIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
      <circle cx="16" cy="16" r="15" fill="url(#gf)" />
      <path d="M8 12h16M8 17h10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 22l4 3v-3" fill="#fff" />
      <defs>
        <linearGradient id="gf" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
function XIcon() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>; }
function GithubIcon() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>; }
function DiscordIcon() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.055a19.859 19.859 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>; }
function LinkedInIcon() { return <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>; }
