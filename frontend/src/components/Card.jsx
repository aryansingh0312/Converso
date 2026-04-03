const variantClasses = {
  default:  "bg-[rgba(20,20,40,0.85)] border border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.3)]",
  glass:    "bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.25)]",
  outlined: "bg-transparent border border-[rgba(99,102,241,0.3)]",
  flat:     "bg-[rgba(15,15,30,0.6)]",
};

const paddingClasses = {
  none: "",
  sm:   "p-3",
  md:   "p-5",
  lg:   "p-7",
};

/**
 * Props: variant, padding, hoverable, clickable, header (node), footer (node)
 * Sub-components: Card.Header, Card.Body, Card.Footer
 */
export default function Card({
  children,
  variant = "default",
  padding = "md",
  hoverable = false,
  clickable = false,
  header,
  footer,
  className = "",
  ...rest
}) {
  return (
    <div
      className={[
        "rounded-2xl relative overflow-hidden transition-all duration-300",
        variantClasses[variant],
        hoverable ? "hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(99,102,241,0.2)]" : "",
        clickable ? "cursor-pointer active:scale-[0.98]" : "",
        className,
      ].filter(Boolean).join(" ")}
      {...rest}
    >
      {header && (
        <div className="px-5 pt-4 pb-3 border-b border-white/[0.06] font-heading font-semibold text-base text-[#e0e0f8] flex items-center gap-2">
          {header}
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-2">
          {footer}
        </div>
      )}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = "", ...rest }) {
  return (
    <div className={`px-5 pt-4 pb-3 border-b border-white/[0.06] font-heading font-semibold text-base text-[#e0e0f8] flex items-center gap-2 ${className}`} {...rest}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = "", ...rest }) {
  return (
    <div className={`p-5 ${className}`} {...rest}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = "", ...rest }) {
  return (
    <div className={`px-5 py-3 border-t border-white/[0.06] flex items-center gap-2 ${className}`} {...rest}>
      {children}
    </div>
  );
};
