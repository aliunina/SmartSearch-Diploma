import "./Error.css";

import Button from "../../components/inputs/Button/Button";

import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  const navToMain = () => {
    navigate("/", {
      replace: true
    });
  };

  return (
    <div className="error-page-container">
      <img
        className="error-page-image"
        src="page_not_found.png"
        alt="Страница не найдена"
      />
      <div className="error-page-text">Такой страницы не существует.</div>
      <Button className="error-page-button" onClick={navToMain}>
        На главную
      </Button>
    </div>
  );
}
