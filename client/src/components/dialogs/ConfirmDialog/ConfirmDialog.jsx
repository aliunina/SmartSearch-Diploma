import "./ConfirmDialog.css";

import Button from "../../inputs/Button/Button";
import BusyIndicator from "../../visuals/BusyIndicator/BusyIndicator";

export default function ConfirmDialog({
  text,
  data,
  dialogBusy,
  title,
  confirmButtonType,
  confirmButtonText,
  dialogClose
}) {
  return (
    <div className="darkened-background">
      <form className="dialog-size dialog-wrap confirm-dialog-wrap">
        {dialogBusy && (
          <div className="dialog-size dialog-busy-background">
            <BusyIndicator />
          </div>
        )}
        <p className="dialog-title confirm-dialog-title">{title}</p>
        <div className="confirm-dialog-text">{text}</div>
        <div className="dialog-buttons-container confirm-dialog-buttons">
          <Button
            onClick={() => dialogClose("cancel", data)}
            type="button"
            className="transparent-button"
          >
            Отменить
          </Button>
          <Button
            onClick={() => dialogClose("confirm", data)}
            type="button"
            className={`accent-button ${
              confirmButtonType === "delete"
                ? "confirm-dialog-delete-button"
                : ""
            }`}
          >
            {confirmButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
}
