import { useCallback, useEffect, useState } from "react";

export function useOnClickOutside(ref: React.RefObject<HTMLDivElement | HTMLElement>, handler: () => void) {
  useEffect(
    () => {
      const listener = (event: MouseEvent | TouchEvent) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target as HTMLDivElement)) return;
        handler();
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    [ref, handler]
  );
}

export function useToggle(initialState = false): [boolean, () => void] {
  const [state, setState] = useState<boolean>(initialState);
  const toggle = useCallback(() => setState(state => !state), []);
  return [state, toggle];
}
