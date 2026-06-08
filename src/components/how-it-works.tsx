import { css } from "styled-system/css";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function HowItWorks() {
  return (
    <div
      className={css({
        maxW: "7xl",
        mx: "auto",
        px: "4",
        pb: { base: "6", md: "8" },
      })}
    >
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", md: "repeat(3, 1fr)" },
          gap: "6",
        })}
      >
        <Card size="lg">
          <CardHeader>
            <CardTitle>Set Your Limit</CardTitle>
            <CardDescription>
              Choose 5-20 "sokay" items and choose your timeframe ( 1 month to 1
              year ). Most of what we sold in the Standard American Diet is not
              the ideal. Build awareness and keep trying.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card size="lg">
          <CardHeader>
            <CardTitle>Track Imperfections</CardTitle>
            <CardDescription>
              Log food items when you feel you have strayed from your ideal way
              of eating. Stay aware without judgment. Remember where you want to
              go - and stay realistic about the environment you live in.{" "}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card size="lg">
          <CardHeader>
            <CardTitle>Build In Forgiveness</CardTitle>
            <CardDescription>
              The process is about{" "}
              <span
                className={css({ color: "fg.default", fontWeight: "medium" })}
              >
                not
              </span>{" "}
              beating yourself up. The important thing is staying on the path.
              There will be ups and downs. Plan for them and anticipate falls.
              Simply pick yourself up and keep moving forward.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
