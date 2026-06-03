import { createFileRoute, Link } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className={css({ minH: "screen", bg: "bg.canvas" })}>
      <header
        className={css({
          borderBottomWidth: "1px",
          borderColor: "border.default",
          bg: "bg.default/95",
          backdropFilter: "blur(8px)",
        })}
      >
        <div
          className={css({
            maxW: "7xl",
            mx: "auto",
            px: "4",
            display: "flex",
            h: "16",
            alignItems: "center",
            justifyContent: "space-between",
          })}
        >
          <h1
            className={css({
              fontSize: "2xl",
              fontWeight: "bold",
              color: "fg.default",
            })}
          >
            sokay
          </h1>
          <nav
            className={css({ display: "flex", alignItems: "center", gap: "3" })}
          >
            <ThemeToggle />
            <Link to="/login">
              <Button variant="plain">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className={css({ maxW: "7xl", mx: "auto", px: "4", py: "20" })}>
        <div className={css({ maxW: "4xl", mx: "auto", textAlign: "center" })}>
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              gap: "4",
              mb: "8",
            })}
          >
            <h2
              className={css({
                fontSize: { base: "4xl", md: "5xl" },
                fontWeight: "bold",
                letterSpacing: "tight",
                color: "fg.default",
                lineHeight: "tight",
              })}
            >
              It's okay to not eat perfectly all the time
            </h2>
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "4",
                mt: "8",
              })}
            >
              <p
                className={css({
                  fontSize: "xl",
                  color: "fg.muted",
                  maxW: { base: "2xl", md: "none" },
                  mx: { base: "auto", md: "0" },
                  textAlign: { base: "center", md: "left" },
                })}
              >
                We all eat things we know are not good for us. Build a healthier
                relationship with food by tracking your "mistakes" with self
                forgiveness.
              </p>
              <p
                className={css({
                  fontSize: "xl",
                  color: "fg.muted",
                  maxW: { base: "2xl", md: "none" },
                  mx: { base: "auto", md: "0" },
                  textAlign: { base: "center", md: "left" },
                })}
              >
                Set your own budget, stay accountable, and remember--100%
                perfection is not the goal.
              </p>
            </div>
          </div>

          <div
            className={css({
              display: "flex",
              justifyContent: "center",
              gap: "4",
              mb: "16",
            })}
          >
            <Link to="/signup">
              <Button size="lg">Start Your Journey</Button>
            </Link>
          </div>

          <div
            className={css({
              display: "grid",
              gridTemplateColumns: { base: "1fr", md: "repeat(3, 1fr)" },
              gap: "6",
              mb: "16",
            })}
          >
            <Card>
              <CardHeader>
                <CardTitle>Set Your Budget</CardTitle>
                <CardDescription>
                  Choose 5-20 "sokay" credits and a timeframe (1 month to 1
                  year)
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Track Imperfections</CardTitle>
                <CardDescription>
                  Log your the food item when you indulge. Stay aware without
                  judgment. Stay mindful of where you want to go - and stay
                  realistic about the world we live in.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Build In Forgiveness</CardTitle>
                <CardDescription>
                  Life isn't about perfection. It's about balance and being kind
                  to yourself.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className={css({ fontSize: "2xl!" })}>
                The Sokay Philosophy
              </CardTitle>
            </CardHeader>
            <CardBody
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "4",
                color: "fg.muted",
                textAlign: "left",
              })}
            >
              <p>
                Your body thrives when you eat well 90% of the time. The other
                10%? That's life—celebrations, cravings, and the environment we
                live in. We are all fish swimming upstream - if our destination
                is good health. And why else would you be reading this if you
                did not want that?
              </p>
              <p>
                Sokay helps you stay mindful of these moments without guilt. Set
                a realistic budget for your sugary, high calorie and
                ultraprocessed food items. Track them honestly, and watch as you
                naturally build healthier habits by searching for delicious and
                nutritious options alternatives while still living with self
                compassion.
              </p>
              <p className={css({ fontWeight: "medium", color: "fg.default" })}>
                Remember: It's okay. The process is everything.
              </p>
              <p className={css({ fontWeight: "medium", color: "fg.default" })}>
                Set your budget as a goal. Try to meet or stay under that
                budget. Stay aware.
              </p>

              <p className={css({ fontWeight: "medium", color: "fg.default" })}>
                Know that mistakes will inevitably happen
              </p>
              <p className={css({ fontWeight: "medium", color: "fg.default" })}>
                And if at first you don't succeed. Try and try again.
              </p>
              <p className={css({ fontWeight: "medium", color: "fg.default" })}>
                Focus on the journey process. The destination result will follow
              </p>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
