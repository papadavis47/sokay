import { createFileRoute } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { HomeNav } from "@/components/home-nav";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { OriginStory } from "@/components/origin-story";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className={css({ minH: "screen", bg: "bg.canvas" })}>
      <HomeNav />

      <main>
        <HeroSection />

        <HowItWorks />

        <OriginStory />
      </main>
    </div>
  );
}
