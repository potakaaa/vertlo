import { Fragment, type ReactNode } from "react";

/** Two-font headings: `*words*` in a content string render in the italic serif (`.lp-serif`). */
export function rich(text: string): ReactNode {
  return text.split("*").map((part, i) =>
    i % 2 ? (
      <em key={i} className="lp-serif">
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
