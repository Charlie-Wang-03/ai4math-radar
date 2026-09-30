import { SITE } from "@aihot/industry/site";

const LABELS = {
  daily: "日报",
  weekly: "周报",
  monthly: "月报",
  archive: "合订本",
} as const;

/**
 * Report nameplates are rendered from SITE.subject at runtime instead of pre-generated SVG paths.
 * This keeps derived sites from shipping a stale template-era subject after domain rebranding.
 */
export function Nameplate({ which, className = "" }: { which: keyof typeof LABELS; className?: string }) {
  const archive = which === "archive";
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap font-black leading-none tracking-[-0.04em] ${className}`} aria-hidden="true">
      <span className="text-accent">{archive ? "日报" : SITE.subject}</span>
      <span className="text-ink">{LABELS[which]}</span>
    </span>
  );
}
