import Button from "../Button/Button";
import "./Avatar.css";

export default function Avatar({ ...props }) {
  return (
    <Button className="avatar-button">
      <img className="avatar" src={"avatar.svg"} alt="Аватар" {...props} />
    </Button>
  );
}
