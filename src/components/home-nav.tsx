import { Link } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandMark } from "@/components/brand-mark";
import { MobileNav } from "@/components/mobile-nav";

const brandLinkStyles = css({
  color: "brand.solid",
  _hover: { bg: "brand.subtle" },
});

export function HomeNav() {
  return (
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
        <BrandMark to="/" />

        <div
          className={css({ display: "flex", alignItems: "center", gap: "3" })}
        >
          <ThemeToggle />

          {/* Desktop nav */}
          <nav
            className={css({
              display: { base: "none", md: "flex" },
              alignItems: "center",
              gap: "3",
            })}
          >
            <Link to="/login">
              <Button variant="plain" className={brandLinkStyles}>
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="plain" className={brandLinkStyles}>
                Get Started
              </Button>
            </Link>
          </nav>

          {/* Mobile nav */}
          <div className={css({ display: { base: "block", md: "none" } })}>
            <MobileNav label="Menu">
              {(close) => (
                <>
                  <Link to="/login" onClick={close}>
                    <Button
                      variant="plain"
                      className={css({
                        w: "full",
                        justifyContent: "flex-start",
                        color: "brand.solid",
                        _hover: { bg: "brand.subtle" },
                      })}
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={close}>
                    <Button
                      variant="plain"
                      className={css({
                        w: "full",
                        justifyContent: "flex-start",
                        color: "brand.solid",
                        _hover: { bg: "brand.subtle" },
                      })}
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </MobileNav>
          </div>
        </div>
      </div>
    </header>
  );
}
