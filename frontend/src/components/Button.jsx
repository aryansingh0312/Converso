const variants = {
  primary:   "bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_4px_14px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.55)]",
  secondary: "bg-[rgba(99,102,241,0.15)] text-[#c4b5fd] border border-[rgba(99,102,241,0.3)] hover:bg-[rgba(99,102,241,0.25)] hover:border-[rgba(99,102,241,0.5)]",
  ghost:     "bg-transparent text-[rgba(200,200,230,0.75)] border border-white/10 hover:bg-white/[0.06] hover:text-[#e0e0f8] hover:border-white/[0.18]",
  danger:    "bg-gradient-to-br from-[#f43f5e] to-[#e11d48] text-white shadow-[0_4px_14px_rgba(244,63,94,0.35)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.5)]",
};

const sizes = {
  sm: "text-[0.78rem] px-[0.85rem] py-[0.38rem] rounded-lg",
  md: "text-sm px-5 py-[0.55rem] rounded-[10px]",
  lg: "text-base px-[1.6rem] py-[0.72rem] rounded-xl",
};

/**
 * Props: variant, size, iconLeft, iconRight, loading, fullWidth, ...native button props
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  loading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...rest
}) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-[0.45rem]",
        "font-sans font-semibold tracking-[0.01em]",
        "border-none cursor-pointer whitespace-nowrap relative overflow-hidden",
        "transition-all duration-200",
        "before:content-[''] before:absolute before:inset-0 before:bg-white/[0.08] before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 before:rounded-[inherit]",
        "active:scale-[0.96] disabled:opacity-45 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        loading ? "cursor-wait" : "",
        className,
      ].filter(Boolean).join(" ")}
      {...rest}
    >
      {loading && (
        <svg className="w-[1em] h-[1em] animate-spin-fast" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      )}
      {!loading && iconLeft && <span className="flex items-center [&>svg]:w-[1em] [&>svg]:h-[1em]">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {!loading && iconRight && <span className="flex items-center [&>svg]:w-[1em] [&>svg]:h-[1em]">{iconRight}</span>}
    </button>
  );
}
