import {
  SPONSORSHIP_HEADS,
  TEAM_MAILTO,
  SOCIAL_LINKS,
} from "@/constants/navigation";

export { SPONSORSHIP_HEADS, TEAM_MAILTO };

const SOCIALS = [
  {
    name: "Instagram",
    href: SOCIAL_LINKS.instagram,
    icon: InstagramIcon,
  },
  {
    name: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    icon: LinkedInIcon,
  },
  {
    name: "Facebook",
    href: SOCIAL_LINKS.facebook,
    icon: FacebookIcon,
  },
];

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-4 w-4"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9.5h4v11H3v-11Zm6.5 0h3.8v1.6h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1v5.3h-4v-4.7c0-1.12-.02-2.56-1.56-2.56-1.57 0-1.8 1.22-1.8 2.48v4.78h-4v-11Z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M13.5 21v-7.5h2.6l.4-3h-3v-1.9c0-.87.24-1.46 1.49-1.46h1.6V4.46A21 21 0 0 0 14.27 4c-2.3 0-3.87 1.4-3.87 3.98V10.5H7.8v3h2.6V21h3.1Z" />
    </svg>
  );
}

const link = "transition-colors hover:text-gold";

/** Single-line transparent footer strip matching exact design specification. */
export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`relative z-100 flex flex-col items-center justify-center gap-1.5 bg-black/80 backdrop-blur-md border-t border-gold/15 px-4 py-3 pb-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-parchment/80 md:flex-row md:justify-between md:gap-x-8 md:px-[4vw] md:py-4 md:text-left ${className}`}
    >
      {/* Line 1: Brand & Contact Info */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
        <span className="text-gold/90 font-semibold">
          © {new Date().getFullYear()} ECLECIA
        </span>
        <span className="text-gold/30">·</span>
        <a
          href={`mailto:${SOCIAL_LINKS.emailOfficial}`}
          className={`${link} normal-case tracking-widest`}
        >
          {SOCIAL_LINKS.emailOfficial}
        </a>
        <span className="hidden sm:inline text-gold/30">·</span>
        <span className="flex items-center gap-2">
          <a href={`tel:${SOCIAL_LINKS.phonePrimary.replace(/\s/g, "")}`} className={link}>
            {SOCIAL_LINKS.phonePrimary}
          </a>
          <a href={`tel:${SOCIAL_LINKS.phoneSecondary.replace(/\s/g, "")}`} className={link}>
            {SOCIAL_LINKS.phoneSecondary}
          </a>
        </span>
      </div>

      {/* Line 2: Social Icons & Credits */}
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2.5">
          {SOCIALS.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className={`${link} text-gold/80 hover:text-gold`}
            >
              <Icon />
            </a>
          ))}
        </div>
        <span className="text-gold/30">·</span>
        <span className="normal-case tracking-[0.08em] text-parchment/70 text-[9.5px]">
          Made with <span className="text-gold">♥</span> by Eclecia Tech Team
        </span>
      </div>
    </footer>
  );
}
