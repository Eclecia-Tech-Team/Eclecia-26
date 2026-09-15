"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Wraps children in a container that fades from opacity-0 to opacity-100
 * on first mount. Gives every page a smooth entrance instead of a jarring pop-in.
 */
export function PageFade({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // One rAF ensures the browser has painted the initial opacity-0 frame
    // before we trigger the transition.
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`transition-opacity duration-700 ease-out ${visible ? "opacity-100" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
