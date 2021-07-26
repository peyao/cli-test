import { useEffect, useRef } from "react";

export default function useOnce(effect) {
  const didRun = useRef(false);
  useEffect(() => {
    if (!didRun.current) {
      didRun.current = true;
      const result = effect();
      return () => {
        if (didRun.current) {
          if (typeof result === "function") {
            result();
          } else if (result) {
            console.warn("The return value of useOnce() functions must be a function!  Did you use an async function by accident?");
          }
        }
      };
    }
  }, [effect]);
}