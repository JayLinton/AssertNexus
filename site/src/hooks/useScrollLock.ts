import { useEffect, useRef } from "react";

let lockCount = 0;

/**
 * Shared scroll lock with reference counting.
 * Multiple components can lock simultaneously; scroll is only restored
 * when all locks are released.
 */
export function useScrollLock(locked: boolean) {
  const wasLocked = useRef(false);

  useEffect(() => {
    if (locked && !wasLocked.current) {
      lockCount++;
      if (lockCount === 1) {
        document.body.style.overflow = "hidden";
      }
      wasLocked.current = true;
    } else if (!locked && wasLocked.current) {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = "";
      }
      wasLocked.current = false;
    }

    return () => {
      if (wasLocked.current) {
        lockCount = Math.max(0, lockCount - 1);
        if (lockCount === 0) {
          document.body.style.overflow = "";
        }
        wasLocked.current = false;
      }
    };
  }, [locked]);
}
