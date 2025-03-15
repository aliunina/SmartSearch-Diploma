import "./CustomDatePicker.css";
import { getFormmattedDate } from "../../helpers/util";

export default function CustomDatePicker({ ...props }) {
  return (
    <div className="date-picker-container">
      <input
        type="date"
        className="date-picker"
        min="1900-01-01"
        max={getFormmattedDate(Date.now())}
        {...props}
      />
      <span className="date-picker-icon">
        <button type="button"><img src="calendar.svg"/></button>
      </span>
    </div>
  );
}
