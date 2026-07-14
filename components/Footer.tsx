export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 py-10 text-center text-sm text-white/45">
      <p>© {new Date().getFullYear()} TomaTok · TOTT</p>
      <p className="mt-1">
        <a
          href="https://github.com/Needspsersand/WHITEPAPER"
          className="underline-offset-2 hover:text-white hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          White Paper (EN)
        </a>
        {" · "}
        <a
          href="https://github.com/Needspsersand/WHITEPAPER-KO"
          className="underline-offset-2 hover:text-white hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          화이트페이퍼 (KO)
        </a>
      </p>
    </footer>
  );
}
