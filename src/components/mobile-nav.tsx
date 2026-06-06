import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { css } from "styled-system/css";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  /**
   * Drawer contents. Receives a `close` callback so links/buttons can dismiss
   * the drawer when activated.
   */
  children: (close: () => void) => ReactNode;
  /** Accessible label for the drawer dialog. */
  label?: string;
}

export function MobileNav({ children, label = "Navigation" }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Lock body scroll + close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <Button
        variant="plain"
        size="sm"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={css({ color: "brand.solid", _hover: { bg: "brand.subtle" } })}
      >
        <Menu size={22} />
      </Button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={close}
                  className={css({
                    position: "fixed",
                    inset: "0",
                    bg: "black/50",
                    zIndex: "overlay",
                  })}
                />

                <motion.aside
                  role="dialog"
                  aria-modal="true"
                  aria-label={label}
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 320, damping: 34 }}
                  className={css({
                    position: "fixed",
                    top: "0",
                    left: "0",
                    h: "full",
                    w: { base: "80%", sm: "20rem" },
                    maxW: "20rem",
                    bg: "bg.default",
                    borderRightWidth: "1px",
                    borderColor: "border.default",
                    boxShadow: "lg",
                    zIndex: "modal",
                    display: "flex",
                    flexDirection: "column",
                    p: "4",
                  })}
                >
                  <div
                    className={css({
                      display: "flex",
                      justifyContent: "flex-end",
                      mb: "2",
                    })}
                  >
                    <Button
                      variant="plain"
                      size="sm"
                      aria-label="Close menu"
                      onClick={close}
                    >
                      <X size={22} />
                    </Button>
                  </div>

                  <nav
                    className={css({
                      display: "flex",
                      flexDirection: "column",
                      gap: "1",
                    })}
                  >
                    {children(close)}
                  </nav>
                </motion.aside>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
