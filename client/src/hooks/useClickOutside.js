import { useEffect } from "react";
import { useSelector } from "react-redux";

const useClickOutside = (ref, func) => {
  const { deleteTaskLoading } = useSelector((state) => state.task);
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current?.contains(event.target)) {
        return;
      }
      if (deleteTaskLoading) return;
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
