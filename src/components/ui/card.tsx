import {
  type ComponentProps,
  createContext,
  forwardRef,
  useContext,
} from "react";
import { css, cx } from "styled-system/css";

export type CardSize = "sm" | "lg";

// All card variant differences live in this file. Set `size` on <Card> and it
// flows to the header/title/description via context, so consumers only choose
// the variant in one place (e.g. <Card size="lg">).
const CardSizeContext = createContext<CardSize>("sm");

const cardStyles = css({
  bg: "bg.default",
  borderRadius: "l3",
  borderWidth: "1px",
  borderColor: "border.default",
  boxShadow: "xs",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  position: "relative",
});

const cardHeaderStyles: Record<CardSize, string> = {
  sm: css({ display: "flex", flexDirection: "column", gap: "1", p: "6" }),
  lg: css({ display: "flex", flexDirection: "column", gap: "2", p: "6" }),
};

const cardBodyStyles: Record<CardSize, string> = {
  sm: css({ display: "flex", flexDirection: "column", pb: "6", px: "6" }),
  lg: css({ display: "flex", flexDirection: "column", pb: "6", px: "6" }),
};

const cardFooterStyles: Record<CardSize, string> = {
  sm: css({ display: "flex", alignItems: "center", p: "6", pt: "0" }),
  lg: css({ display: "flex", alignItems: "center", p: "6", pt: "0" }),
};

const cardTitleStyles: Record<CardSize, string> = {
  sm: css({ fontSize: "lg", fontWeight: "semibold", lineHeight: "tight" }),
  lg: css({ fontSize: "xl", fontWeight: "semibold", lineHeight: "tight" }),
};

const cardDescriptionStyles: Record<CardSize, string> = {
  sm: css({ fontSize: "sm", color: "fg.muted" }),
  lg: css({ fontSize: "md", color: "fg.muted", lineHeight: "relaxed" }),
};

interface CardProps extends ComponentProps<"div"> {
  size?: CardSize;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, size = "sm", ...props },
  ref,
) {
  return (
    <CardSizeContext.Provider value={size}>
      <div ref={ref} className={cx(cardStyles, className)} {...props} />
    </CardSizeContext.Provider>
  );
});

export const CardHeader = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function CardHeader({ className, ...props }, ref) {
    const size = useContext(CardSizeContext);
    return (
      <div
        ref={ref}
        className={cx(cardHeaderStyles[size], className)}
        {...props}
      />
    );
  },
);

export const CardBody = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function CardBody({ className, ...props }, ref) {
    const size = useContext(CardSizeContext);
    return (
      <div
        ref={ref}
        className={cx(cardBodyStyles[size], className)}
        {...props}
      />
    );
  },
);

export const CardFooter = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function CardFooter({ className, ...props }, ref) {
    const size = useContext(CardSizeContext);
    return (
      <div
        ref={ref}
        className={cx(cardFooterStyles[size], className)}
        {...props}
      />
    );
  },
);

export const CardTitle = forwardRef<HTMLHeadingElement, ComponentProps<"h3">>(
  function CardTitle({ className, ...props }, ref) {
    const size = useContext(CardSizeContext);
    return (
      <h3
        ref={ref}
        className={cx(cardTitleStyles[size], className)}
        {...props}
      />
    );
  },
);

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  ComponentProps<"p">
>(function CardDescription({ className, ...props }, ref) {
  const size = useContext(CardSizeContext);
  return (
    <p
      ref={ref}
      className={cx(cardDescriptionStyles[size], className)}
      {...props}
    />
  );
});
