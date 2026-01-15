"use client";

import { useEffect, useRef } from "react";

import { useSound } from "@/hooks/use-sound";

export function GlobalSoundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const playClick = useSound("/audio/ui-sounds/click.wav");
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const isButton =
        target.tagName === "BUTTON" ||
        target.closest("button") !== null ||
        target.getAttribute("role") === "button" ||
        target.closest('[role="button"]') !== null ||
        (target.tagName === "A" && target.getAttribute("href")) ||
        target.closest("a[href]") !== null;

      if (!isButton) return;

      const buttonElement =
        target.tagName === "BUTTON"
          ? target
          : target.closest("button") ||
            target.closest('[role="button"]') ||
            target.closest("a[href]");

      // Check if button itself or any parent has data-has-sound
      const hasSound =
        buttonElement?.getAttribute("data-has-sound") === "true" ||
        buttonElement?.closest('[data-has-sound="true"]') !== null ||
        target.closest('[data-has-sound="true"]') !== null;

      if (hasSound) return;

      if (isPlayingRef.current) return;

      isPlayingRef.current = true;
      playClick(0.3);

      setTimeout(() => {
        isPlayingRef.current = false;
      }, 100);
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [playClick]);

  return <>{children}</>;
}
