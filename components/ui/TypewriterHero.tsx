"use client";

import { useEffect, useRef, useState } from "react";

// Edit these two lines to change what gets typed.
const LINE_1 = "Accept Stablecoin";
const LINE_2 = "Payments Across Africa";

const MS_PER_CHAR = 45; // lower = faster typing
const PAUSE_BETWEEN_LINES_MS = 200;

export function TypewriterHero() {
  const measureRef1 = useRef<HTMLSpanElement>(null);
  const measureRef2 = useRef<HTMLSpanElement>(null);
  const [widths, setWidths] = useState<{ w1: number; w2: number } | null>(null);

  // Measure the natural pixel width of each line ONCE on mount.
  // Everything after this is handled by native CSS animation, not React.
  useEffect(() => {
    if (measureRef1.current && measureRef2.current) {
      setWidths({
        w1: measureRef1.current.offsetWidth,
        w2: measureRef2.current.offsetWidth,
      });
    }
  }, []);

  const dur1 = LINE_1.length * MS_PER_CHAR;
  const dur2 = LINE_2.length * MS_PER_CHAR;
  const delay2 = dur1 + PAUSE_BETWEEN_LINES_MS;

  return (
    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
      {/* Invisible copies used only to measure text width, never shown */}
      <span ref={measureRef1} className="type-measure">
        {LINE_1}
      </span>
      <span ref={measureRef2} className="type-measure">
        {LINE_2}
      </span>

      {widths && (
        <>
          <span className="type-line type-line-1">{LINE_1}</span>
          <br />
          <span className="gradient-text type-line type-line-2">{LINE_2}</span>
        </>
      )}

      <style jsx>{`
        .type-measure {
          position: absolute;
          visibility: hidden;
          white-space: nowrap;
          pointer-events: none;
        }
        .type-line {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          vertical-align: bottom;
          width: 0;
          border-right: 3px solid currentColor;
        }
        .type-line-1 {
          animation:
            reveal1 ${dur1}ms steps(${LINE_1.length}, end) forwards,
            hideCaret1 1ms ${dur1}ms forwards;
        }
        .type-line-2 {
          border-right-color: transparent;
          animation:
            reveal2 ${dur2}ms steps(${LINE_2.length}, end) ${delay2}ms forwards,
            showCaret2 1ms ${delay2}ms forwards,
            hideCaret2 1ms ${delay2 + dur2}ms forwards;
        }
        @keyframes reveal1 {
          to {
            width: ${widths?.w1 ?? 0}px;
          }
        }
        @keyframes reveal2 {
          to {
            width: ${widths?.w2 ?? 0}px;
          }
        }
        @keyframes showCaret2 {
          to {
            border-color: currentColor;
          }
        }
        @keyframes hideCaret1 {
          to {
            border-color: transparent;
          }
        }
        @keyframes hideCaret2 {
          to {
            border-color: transparent;
          }
        }
      `}</style>
    </h1>
  );
}
