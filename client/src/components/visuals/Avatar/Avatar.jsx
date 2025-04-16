import Button from "../../inputs/Button/Button";
import "./Avatar.css";

export default function Avatar({ parentClassName, clickable, size, ...props }) {
  return (
    <Button
      className={`avatar-button ${parentClassName ? parentClassName : ""}`}
    >
      <img
        style={{ width: size }}
        className={`${clickable ? "avatar-clickable avatar" : "avatar"}`}
        src="avatar.svg"
        alt="Аватар"
        {...props}
      />
    </Button>
  );
}
