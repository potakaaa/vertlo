import { Fragment, type ReactNode } from "react";

/** Accent words: `*words*` in a content string render in the accent green (`.bd-accent`), same face as the rest. */
export function rich(text: string): ReactNode {
  return text.split("*").map((part, i) =>
    i % 2 ? (
      <em key={i} className="bd-accent">
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
