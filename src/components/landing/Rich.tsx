import { Fragment, type ReactNode } from "react";

/** Accent words: `*words*` in a content string render in the ink colour (`.pp-ink`), same face as the rest. */
export function rich(text: string): ReactNode {
  return text.split("*").map((part, i) =>
    i % 2 ? (
      <em key={i} className="pp-ink">
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
