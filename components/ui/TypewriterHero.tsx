"use client";

import { useEffect, useState } from "react";

// Edit these two lines to change what gets typed.
const LINE_1 = "Accept Stablecoin";
const LINE_2 = "Payments Across Africa";

const MS_PER_CHAR = 45; // lower = faster typing
const PAUSE_BETWEEN_LINES_MS = 200;

export function TypewriterHero() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Kick off the animation on the next frame. The heading box itself
    // never changes size (see CSS below) — only a mask moves — so
    // nothing on the page below it ever has to reflow.
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const dur1 = LINE_1.length * MS_PER_CHAR;
  const dur2 = LINE_2.length * MS_PER_CHAR;
  const delay2 = dur1 + PAUSE_BETWEEN_LINES_MS;
  const cursorStart = delay2 + dur2;

  return (
    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
      <span className={`type-line ${ready ? "line1" : ""}`}>{LINE_1}</span>
      <br />
      <span className={`gradient-text type-line ${ready ? "line2" : ""}`}>
        {LINE_2}
        <span className="caret" />
      </span>

      <style jsx>{`
        .type-line {
          display: inline-block;
          -webkit-clip-path: inset(0 100% 0 0);
          clip-path: inset(0 100% 0 0);
        }
        .type-line.line1 {
          animation: reveal ${dur1}ms steps(${LINE_1.length}, end) forwards;
        }
        .type-line.line2 {
          animation: reveal ${dur2}ms steps(${LINE_2.length}, end) ${delay2}ms
            forwards;
        }
        @keyframes reveal {
          to {
            -webkit-clip-path: inset(0 0 0 0);
            clip-path: inset(0 0 0 0);
          }
        }
        .caret {
          display: inline-block;
          width: 3px;
          height: 0.85em;
          margin-left: 4px;
          vertical-align: -0.1em;
          background: currentColor;
          opacity: 0;
        }
        .line2 .caret {
          animation: blinkThenHide 1.2s steps(1, end) ${cursorStart}ms forwards;
        }
        @keyframes blinkThenHide {
          0%,
          20%,
          40% {
            opacity: 1;
          }
          10%,
          30%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </h1>
  );
}
