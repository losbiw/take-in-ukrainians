import { useEffect, useState } from "react";

const useWidth = () => {
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  return width;
};

export default useWidth;
