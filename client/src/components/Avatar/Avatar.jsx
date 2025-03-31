import Button from "../Button/Button";
import "./Avatar.css";

export default function Avatar({ parentClassName, ...props }) {
  return (
    <Button className={`avatar-button ${parentClassName ? parentClassName : ""}`}>
      <img className="avatar" src={"avatar.svg"} alt="Аватар" {...props} />
    </Button>
  );
}
