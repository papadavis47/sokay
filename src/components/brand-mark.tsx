import { Link } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { SokayMark } from "@/components/sokay-mark";

interface BrandMarkProps {
  /** Optional route to wrap the mark in a link. */
  to?: "/" | "/dashboard";
  /** Visual size — `md` for headers (default), `sm` for the footer. */
  size?: "sm" | "md";
}

export function BrandMark({ to, size = "md" }: BrandMarkProps) {
  const titleSize = size === "md" ? "2xl" : "lg";
  const taglineSize = size === "md" ? "sm" : "xs";
  const markSize = size === "md" ? 28 : 20;

  const content = (
    <div
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "2.5",
        lineHeight: "tight",
      })}
    >
      <span className={css({ color: "brand.solid", display: "inline-flex" })}>
        <SokayMark size={markSize} />
      </span>
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
          Progress, not perfection
        </span>
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
}
