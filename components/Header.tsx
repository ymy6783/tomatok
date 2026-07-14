import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/notice", label: "Notice" },
  {
    href: "https://github.com/Needspsersand/WHITEPAPER-KO",
    label: "White Paper",
    external: true,
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b12]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="font-[family-name:var(--font-display)] text-lg tracking-tight text-white">
          Toma<span className="text-[var(--accent)]">Tok</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-white/70">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href} className="hover:text-white">
                {l.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
