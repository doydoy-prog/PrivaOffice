import Link from "next/link";

const navItems = [
  { label: "דשבורד", href: "/", active: true },
  { label: "מאגרי מידע", href: "/data-assets" },
  { label: "מסמכים", href: "/documents" },
  { label: "ספקים", href: "/vendors" },
  { label: "יועץ AI", href: "/assistant" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-navy text-white shadow-[0_2px_12px_rgba(0,0,0,0.1)]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3 md:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold text-navy text-lg font-extrabold">
            D
          </div>
          <span className="text-xl font-bold tracking-tight">DataBee</span>
        </div>

        <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors hover:text-gold ${
                item.active ? "text-gold" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-1.5 text-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-navy text-xs font-bold">
            אח
          </div>
          <span className="hidden md:inline">אחוות תורה</span>
        </div>
      </div>
    </header>
  );
}
