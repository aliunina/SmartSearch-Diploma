import "./MessageToast.css";
import { useEffect, useState } from "react";

export default function MessageToast({ children }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeId = setTimeout(() => {
        setShow(false);
    }, 3000);
    return () => {
      clearTimeout(timeId);
    };
  }, []);

  if (!show) {
    return null;
  }

  return <div className="message-toast">{children}</div>;
}
