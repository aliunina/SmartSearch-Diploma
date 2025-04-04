import "./BusyIndicator.css";
import { OrbitProgress } from "react-loading-indicators";

export default function BusyIndicator({ removeClasses }) {
  return (
    <div className={`${removeClasses ? "" : "busy-container"}`}>
      <OrbitProgress color="#008054" size="medium" text="" textColor="" />
    </div>
  );
}
