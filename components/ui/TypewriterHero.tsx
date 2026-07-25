"use client";

// Edit these two lines to change what gets typed.
const LINE_1 = "Accept Stablecoin";
const LINE_2 = "Payments Across Africa";

const MS_PER_CHAR = 45; // lower = faster typing
const PAUSE_BETWEEN_LINES_MS = 200;

const CURSOR_COLOR = "#34d399"; // emerald-400, matches brand accent

export function TypewriterHero() {
  const dur1 = LINE_1.length * MS_PER_CHAR;
  const dur2 = LINE_2.length * MS_PER_CHAR;
  const delay2 = dur1 + PAUSE_BETWEEN_LINES_MS;

  return (
    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
      <span className="type-wrap">
        {LINE_1}
        <span className="mask mask1" />
      </span>
      <br />
      <span className="gradient-text type-wrap">
        {LINE_2}
        <span className="mask mask2" />
      </span>

      <style jsx>{`
        /* The text itself is ALWAYS fully rendered — it is never
           resized, clipped, or re-typed. Only a covering rectangle
           (the "mask") animates, using transform: scaleX, which is
           the one property every mobile GPU handles natively without
           triggering any page reflow or layout shift. */
        .type-wrap {
          position: relative;
          display: inline-block;
        }
        .mask {
          position: absolute;
          inset: 0;
          background-color: var(--bg-base);
          border-left: 3px solid ${CURSOR_COLOR};
          transform-origin: right center;
          transform: scaleX(1);
          pointer-events: none;
          will-change: transform;
        }
        .mask1 {
          animation: reveal ${dur1}ms steps(${LINE_1.length}, end) forwards;
        }
        .mask2 {
          animation: reveal ${dur2}ms steps(${LINE_2.length}, end) ${delay2}ms
            forwards;
        }
        @keyframes reveal {
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </h1>
  );
}
