import { useState } from "react";
import { toast } from "react-toastify";
import Button from "../components/Button";
import api from "../services/api";

export default function LoginPage({ onBack, onSuccess }) {
  const [tab, setTab]           = useState("login"); // "login" | "register"
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [form, setForm]         = useState({ name: "", email: "", password: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response;
      
      if (tab === "login") {
        response = await api.login(form.email, form.password);
      } else {
        response = await api.register(form.name, form.email, form.password);
      }

      // Save token and user info
      api.setToken(response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      toast.success(tab === "login" ? "Login successful!" : "Registration successful!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      
      // Call success callback
      onSuccess?.(response.user);
    } catch (err) {
      const errorMsg = err.message || "An error occurred. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "bottom-right",
        autoClose: 3000,
      });
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090f] flex items-stretch overflow-hidden relative">

      {/* ── Background orbs ── */}
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none bg-[radial-gradient(circle,rgba(99,102,241,0.25)_0%,transparent_70%)] -top-40 -left-40 animate-orb-1" />
      <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none bg-[radial-gradient(circle,rgba(139,92,246,0.2)_0%,transparent_70%)] -bottom-20 -right-20 animate-orb-2" />

      {/* ══ LEFT PANEL — branding ══ */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] relative overflow-hidden bg-gradient-to-br from-[#0d0d22] to-[#12102a] border-r border-white/[0.05] px-14 py-12">

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none [background-image:linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_30%,transparent_100%)]" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <span className="flex w-9 h-9 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]">
            <BubbleIcon />
          </span>
          <span className="font-heading text-xl font-bold bg-gradient-to-br from-[#a78bfa] to-[#818cf8] bg-clip-text text-transparent">
            Converso
          </span>
        </div>

        {/* Center copy */}
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-4xl font-extrabold text-[#f0f0ff] leading-[1.2] tracking-[-0.03em]">
              Every great conversation<br />
              <span className="bg-gradient-to-br from-[#818cf8] to-[#ec4899] bg-clip-text text-transparent">
                starts here.
              </span>
            </h2>
            <p className="text-[rgba(200,210,240,0.6)] text-[1rem] leading-[1.7] max-w-[38ch]">
              Join thousands of teams who trust Converso for real-time messaging, group chats, and seamless collaboration.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-3">
            {FEATURES.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[rgba(99,102,241,0.15)] border border-[rgba(99,102,241,0.25)] text-[#a78bfa] text-sm shrink-0">
                  {icon}
                </span>
                <span className="text-[0.875rem] text-[rgba(200,210,240,0.7)]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <p className="text-[0.85rem] text-[rgba(200,210,240,0.65)] leading-[1.6] italic mb-3">
            "Converso transformed how our remote team communicates. It's fast, beautiful, and just works."
          </p>
          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah"
              alt="Sarah"
              className="w-8 h-8 rounded-full bg-[#1e1e3a] border border-[rgba(99,102,241,0.3)]"
            />
            <div>
              <p className="text-[0.78rem] font-semibold text-[#e0e0f8]">Sarah Mitchell</p>
              <p className="text-[0.72rem] text-[rgba(200,210,240,0.45)]">Product Lead, Vercel</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — form ══ */}
      <div className="flex flex-col justify-center items-center flex-1 px-6 py-12 relative">

        {/* Back button */}
        <button
          id="login-back-btn"
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-2 text-[0.82rem] text-[rgba(200,210,240,0.5)] hover:text-[#c4b5fd] transition-colors duration-200 cursor-pointer border-none bg-transparent"
        >
          <ChevronLeftIcon />
          Back to home
        </button>

        <div className="w-full max-w-[400px] flex flex-col gap-7">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 justify-center mb-2">
            <span className="flex w-8 h-8"><BubbleIcon /></span>
            <span className="font-heading text-lg font-bold bg-gradient-to-br from-[#a78bfa] to-[#818cf8] bg-clip-text text-transparent">Converso</span>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-1 text-center lg:text-left">
            <h1 className="font-heading text-2xl font-bold text-[#f0f0ff] tracking-[-0.02em]">
              {tab === "login" ? "Welcome back 👋" : "Create your account"}
            </h1>
            <p className="text-[0.875rem] text-[rgba(200,210,240,0.5)]">
              {tab === "login"
                ? "Sign in to continue to Converso"
                : "Start chatting in seconds — it's free"}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl bg-white/[0.04] border border-white/[0.07] p-1 gap-1">
            {["login", "register"].map((t) => (
              <button
                key={t}
                id={`auth-tab-${t}`}
                onClick={() => setTab(t)}
                className={`flex-1 py-[0.45rem] rounded-lg text-sm font-semibold transition-all duration-200 border-none cursor-pointer
                  ${tab === t
                    ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_2px_10px_rgba(99,102,241,0.4)]"
                    : "bg-transparent text-[rgba(200,210,240,0.5)] hover:text-[#e0e0f8]"}`}
              >
                {t === "login" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          {/* Social buttons */}
          <div className="flex flex-col gap-3">
            <button
              id="login-google"
              className="flex items-center justify-center gap-3 w-full py-[0.65rem] rounded-xl border border-white/[0.1] bg-white/[0.04] text-[rgba(200,210,240,0.8)] text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.18] hover:text-white"
            >
              <GoogleIcon /> Continue with Google
            </button>
            <button
              id="login-github"
              className="flex items-center justify-center gap-3 w-full py-[0.65rem] rounded-xl border border-white/[0.1] bg-white/[0.04] text-[rgba(200,210,240,0.8)] text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.18] hover:text-white"
            >
              <GithubIcon /> Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-[0.75rem] text-[rgba(200,210,240,0.35)] whitespace-nowrap">or continue with email</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-[0.85rem] text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name (register only) */}
            {tab === "register" && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="auth-name" className="text-[0.8rem] font-medium text-[rgba(200,210,240,0.65)]">
                  Full name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(200,210,240,0.3)] w-4 h-4 flex items-center justify-center">
                    <UserIcon />
                  </span>
                  <input
                    id="auth-name"
                    type="text"
                    placeholder="Alex Chen"
                    value={form.name}
                    onChange={set("name")}
                    required={tab === "register"}
                    className="w-full pl-10 pr-4 py-[0.65rem] rounded-xl border border-white/[0.1] bg-white/[0.04] text-[#e0e0f8] text-sm placeholder:text-[rgba(180,190,230,0.3)] outline-none transition-all duration-200 focus:border-[rgba(99,102,241,0.5)] focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] caret-[#818cf8]"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-email" className="text-[0.8rem] font-medium text-[rgba(200,210,240,0.65)]">
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(200,210,240,0.3)] w-4 h-4 flex items-center justify-center">
                  <MailIcon />
                </span>
                <input
                  id="auth-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set("email")}
                  required
                  className="w-full pl-10 pr-4 py-[0.65rem] rounded-xl border border-white/[0.1] bg-white/[0.04] text-[#e0e0f8] text-sm placeholder:text-[rgba(180,190,230,0.3)] outline-none transition-all duration-200 focus:border-[rgba(99,102,241,0.5)] focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] caret-[#818cf8]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="auth-password" className="text-[0.8rem] font-medium text-[rgba(200,210,240,0.65)]">
                  Password
                </label>
                {tab === "login" && (
                  <a href="#" id="forgot-password" className="text-[0.78rem] text-[#818cf8] hover:text-[#a78bfa] transition-colors duration-150 no-underline">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(200,210,240,0.3)] w-4 h-4 flex items-center justify-center">
                  <LockIcon />
                </span>
                <input
                  id="auth-password"
                  type={showPass ? "text" : "password"}
                  placeholder={tab === "register" ? "Min. 8 characters" : "Enter your password"}
                  value={form.password}
                  onChange={set("password")}
                  required
                  minLength={tab === "register" ? 8 : undefined}
                  className="w-full pl-10 pr-11 py-[0.65rem] rounded-xl border border-white/[0.1] bg-white/[0.04] text-[#e0e0f8] text-sm placeholder:text-[rgba(180,190,230,0.3)] outline-none transition-all duration-200 focus:border-[rgba(99,102,241,0.5)] focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] caret-[#818cf8]"
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[rgba(200,210,240,0.3)] hover:text-[rgba(200,210,240,0.7)] border-none bg-transparent cursor-pointer p-0 flex items-center w-4 h-4 transition-colors duration-150"
                >
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Remember me (login) */}
            {tab === "login" && (
              <label htmlFor="remember-me" className="flex items-center gap-2.5 cursor-pointer group w-fit">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/[0.04] accent-indigo-500 cursor-pointer"
                />
                <span className="text-[0.8rem] text-[rgba(200,210,240,0.55)] group-hover:text-[rgba(200,210,240,0.8)] transition-colors">
                  Remember me for 30 days
                </span>
              </label>
            )}

            {/* Terms (register) */}
            {tab === "register" && (
              <p className="text-[0.75rem] text-[rgba(200,210,240,0.4)] leading-[1.5]">
                By creating an account you agree to our{" "}
                <a href="#" className="text-[#818cf8] hover:text-[#a78bfa] no-underline transition-colors">Terms</a>
                {" "}and{" "}
                <a href="#" className="text-[#818cf8] hover:text-[#a78bfa] no-underline transition-colors">Privacy Policy</a>.
              </p>
            )}

            {/* Submit */}
            <Button
              id="auth-submit-btn"
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              {tab === "login" ? "Sign in to Converso" : "Create free account"}
            </Button>
          </form>

          {/* Bottom switch */}
          <p className="text-center text-[0.82rem] text-[rgba(200,210,240,0.45)]">
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              id="auth-switch-tab"
              onClick={() => setTab(tab === "login" ? "register" : "login")}
              className="text-[#818cf8] hover:text-[#a78bfa] font-semibold border-none bg-transparent cursor-pointer transition-colors duration-150"
            >
              {tab === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Constants ── */
const FEATURES = [
  { icon: "💬", label: "Real-time messaging with read receipts" },
  { icon: "🔒", label: "End-to-end encrypted conversations" },
  { icon: "👥", label: "Group chats with up to 1,000 members" },
  { icon: "🤖", label: "Built-in AI assistant" },
];

/* ── SVG Icons ── */
function BubbleIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
      <circle cx="16" cy="16" r="15" fill="url(#gl)" />
      <path d="M8 12h16M8 17h10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 22l4 3v-3" fill="#fff" />
      <defs>
        <linearGradient id="gl" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
function ChevronLeftIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>;
}
function GoogleIcon() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
function MailIcon() {
  return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
}
function LockIcon() {
  return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}
function UserIcon() {
  return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function EyeIcon() {
  return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function EyeOffIcon() {
  return <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}
