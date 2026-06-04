import { Link } from "@tanstack/react-router";
import { css } from "styled-system/css";

interface BrandMarkProps {
  /** Optional route to wrap the mark in a link. */
  to?: "/" | "/dashboard";
  /** Visual size — `md` for headers (default), `sm` for the footer. */
  size?: "sm" | "md";
}

export function BrandMark({ to, size = "md" }: BrandMarkProps) {
  const titleSize = size === "md" ? "2xl" : "lg";
  const taglineSize = size === "md" ? "sm" : "xs";

  const content = (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        lineHeight: "tight",
      })}
    >
      <span
        className={css({
          fontSize: titleSize,
          fontWeight: "bold",
          color: "brand.solid",
        })}
      >
        sokay
      </span>
      <span
        className={css({
          fontSize: taglineSize,
          color: "fg.muted",
        })}
      >
        Process, not perfection
      </span>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
}
