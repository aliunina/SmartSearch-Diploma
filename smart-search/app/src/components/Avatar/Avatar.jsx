import Button from "../Button/Button";
import "./Avatar.css";

export default function Avatar() {
  return (
    <Button className="avatar-button">
        <img className="avatar" src={"avatar.svg"} alt="Аватар" />
    </Button>
  );
}
