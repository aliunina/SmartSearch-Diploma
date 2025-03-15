import "./NavMenu.css";
import Button from "../Button/Button";

export default function NavMenu({ setMenuOpen, header, openESDialog }) {
  const close = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="nav-menu">
      <div className="nav-menu-header">
        <div className="nav-menu-close-button-container">
          <Button
            className="nav-menu-close-button"
            type="button"
            title="Закрыть"
            onClick={close}
          >
            <img src="cross.svg" alt="Закрыть" />
          </Button>
        </div>
        {header}
      </div>
      <ul className="nav-menu-actions-list">
        <li>
          <Button className="nav-menu-button">
            <img src="my_profile.svg" alt="Мой профиль" />
            Мой профиль
          </Button>
        </li>
        <li>
          <Button className="nav-menu-button">
            <img src="my_library.svg" alt="Моя библиотека" />
            Моя библиотека
          </Button>
        </li>
        <li>
          <Button className="nav-menu-button">
            <img src="notifications_by_theme.svg" alt="Оповещения по теме" />
            Оповещения по теме
          </Button>
        </li>
        <li>
          <Button className="nav-menu-button">
            <img
              src="notifications_by_article.svg"
              alt="Оповещения по журналам"
            />
            Оповещения по журналам
          </Button>
        </li>
      </ul>
      <div className="nav-menu-button-container">
        <Button className="nav-menu-button" onClick={openESDialog}>
          <img src="nav_menu_extended_search.svg" alt="Расширенный поиск" />
          Расширенный поиск
        </Button>
      </div>
      <div className="nav-menu-button-container">
        <Button className="nav-menu-button">
          <img src="confidentiality.svg" alt="Конфиденциальность" />
          Конфиденциальность
        </Button>
        <Button className="nav-menu-button">
          <img src="help.svg" alt="Справка" />
          Справка
        </Button>
      </div>
    </nav>
  );
}
