"use client";

import { useId, useState } from "react";

/* The questions: one open at a time, the first open to start. The answer's height is a grid-row
   transition, so opening and closing can be interrupted mid-way. */
export function Questions({ items }: { items: { q: string; a: string }[] }) {
  const id = useId();
  const [open, setOpen] = useState(0);
  return (
    <div className="rt-questions">
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div key={it.q} className="rt-q" data-open={on || undefined}>
            <h3>
              <button type="button" aria-expanded={on} aria-controls={`${id}-a${i}`} id={`${id}-q${i}`} onClick={() => setOpen(on ? -1 : i)}>
                <span>{it.q}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10" />
                  <path className="rt-q-bar" d="M8 3v10" />
                </svg>
              </button>
            </h3>
            <div className="rt-q-a" id={`${id}-a${i}`} role="region" aria-labelledby={`${id}-q${i}`} inert={!on}>
              <div>
                <p>{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
