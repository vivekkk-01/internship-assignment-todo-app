import { useEffect } from "react";

const useClickOutside = (ref, func) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current?.contains(event.target)) {
        return;
      }
      func();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref]);
};

export default useClickOutside;
