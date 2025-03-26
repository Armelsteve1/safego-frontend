import { useEffect, useState } from "react";

export default function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    if (typeof window !== "undefined") {
      check();
      window.addEventListener("resize", check);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", check);
      }
    };
  }, [breakpoint]);

  return isMobile;
}
