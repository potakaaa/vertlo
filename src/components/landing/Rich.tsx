import { Fragment, type ReactNode } from "react";

/** Heading accents: `*words*` in a content string keep the heading's font and take the accent colour (`.lp-em`). */
export function rich(text: string): ReactNode {
  return text.split("*").map((part, i) =>
    i % 2 ? (
      <em key={i} className="lp-em">
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
