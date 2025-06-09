import "./NavMenu.css";

import Button from "../../inputs/Button/Button";
import Avatar from "../../visuals/Avatar/Avatar";
import Logo from "../../visuals/Logo/Logo";

import { useContext } from "react";

import { UserContext } from "../../../contexts/UserContext/UserContext";

export default function NavMenu({
  setMenuOpen,
  openESDialog,
  moveToHelp,
  signUp,
  signOut,
  openUserProfile
}) {
  const { user } = useContext(UserContext);

  const close = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="nav-menu">
      <div className="nav-menu-header">
        <div className="nav-menu-close-button-container">
          <Button
            className="close-button nav-menu-close-button"
            type="button"
            title="Закрыть"
            onClick={close}
          >
            <img src="cross.svg" alt="Закрыть" />
          </Button>
        </div>
        {user && (
          <>
            <p className="nav-menu-user-name">
              {user.lastName} {user.firstName}
            </p>
            <Avatar size={"4em"}/>
          </>
        )}
        {!user && (
          <>
            <Logo />
            <p className="nav-menu-description">
              Зарегистрируйтесь в БНТУ Умный поиск, чтобы создавать оповещения
            </p>
            <Button
              type="button"
              className="accent-button"
              onClick={signUp}
            >
              Регистрация в БНТУ Умный поиск
            </Button>
          </>
        )}
      </div>
      {user && (
        <ul className="nav-menu-actions-list">
          <li>
            <Button className="nav-menu-button" onClick={() => openUserProfile(0)}>
              <img src="my_profile.svg" alt="Мой профиль" />
              Мой профиль
            </Button>
          </li>
          <li>
            <Button className="nav-menu-button" onClick={() => openUserProfile(1)}>
              <img src="notifications_by_theme.svg" alt="Оповещения по теме" />
              Оповещения по теме
            </Button>
          </li>
        </ul>
      )}
      <div className="nav-menu-button-container">
        <Button className="nav-menu-button" onClick={openESDialog}>
          <img src="nav_menu_extended_search.svg" alt="Расширенный поиск" />
          Расширенный поиск
        </Button>
      </div>
      <div className="nav-menu-button-container">
        <Button className="nav-menu-button" onClick={moveToHelp}>
          <img src="help.svg" alt="Справка" />
          Справка
        </Button>
      </div>
      {user && (
        <div className="nav-menu-button-container">
          <Button className="nav-menu-button" onClick={signOut}>
            <img src="sign_out.svg" alt="Выход" />
            Выход
          </Button>
        </div>
      )}
    </nav>
  );
}
