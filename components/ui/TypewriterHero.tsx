"use client";

import { useEffect, useState } from "react";

// Edit these two lines to change what gets typed.
const LINE_1 = "Accept Stablecoin";
const LINE_2 = "Payments Across Africa";

const TYPE_SPEED_MS = 45; // lower = faster typing
const PAUSE_BETWEEN_LINES_MS = 200;

export function TypewriterHero() {
  const [line1Typed, setLine1Typed] = useState("");
  const [line2Typed, setLine2Typed] = useState("");
  const [stage, setStage] = useState<"line1" | "pause" | "line2" | "done">("line1");

  useEffect(() => {
    if (stage === "line1") {
      if (line1Typed.length < LINE_1.length) {
        const t = setTimeout(
          () => setLine1Typed(LINE_1.slice(0, line1Typed.length + 1)),
          TYPE_SPEED_MS
        );
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setStage("line2"), PAUSE_BETWEEN_LINES_MS);
        return () => clearTimeout(t);
      }
    }

    if (stage === "line2") {
      if (line2Typed.length < LINE_2.length) {
        const t = setTimeout(
          () => setLine2Typed(LINE_2.slice(0, line2Typed.length + 1)),
          TYPE_SPEED_MS
        );
        return () => clearTimeout(t);
      } else {
        setStage("done");
      }
    }
  }, [stage, line1Typed, line2Typed]);

  const showCursorOnLine1 = stage === "line1";
  const showCursorOnLine2 = stage === "line2" || stage === "done";

  return (
    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
      {line1Typed}
      {showCursorOnLine1 && <Cursor />}
      <br />
      <span className="gradient-text">
        {line2Typed}
        {showCursorOnLine2 && <Cursor />}
      </span>
    </h1>
  );
}

function Cursor() {
  return (
    <span
      style={{
        display: "inline-block",
        width: "0.06em",
        marginLeft: "3px",
        background: "currentColor",
        animation: "blink 1s step-start infinite",
      }}
    >
      &nbsp;
      <style jsx>{`
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}
