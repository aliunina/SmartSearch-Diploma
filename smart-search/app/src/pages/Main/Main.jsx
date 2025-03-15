import "./Main.css";

import Header from "../../layouts/MainLayout/Header/Header";
import Body from "../../layouts/MainLayout/Body/Body";
import Button from "../../components/Button/Button";
import Logo from "../../components/Logo/Logo";
import ExtendedSearchDialog from "../../components/ExtendedSearchDialog/ExtendedSearchDialog";

import RedirectSearchBar from "../../components/RedirectSearchBar/RedirectSearchBar";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import NavMenu from "../../components/NavMenu/NavMenu";
import { ToastContainer } from "react-toastify";
import { showErrorMessageToast } from "../../helpers/util";

export default function Main() {
  const searchBarRef = useRef();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState({});

  const handleRedirect = (searchValue) => {
    if (searchValue.trim()) {
      const urlParams = new URLSearchParams({
        q: searchValue
      });
      navigate("search?" + urlParams.toString());
    } else {
      showErrorMessageToast("Запрос не может быть пустым");
      searchBarRef.current.focus();
    }
  };

  const openMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  const handleOpenESDialog = () => {
    if (searchValue.trim()) {
      setDialogOpen(true);
      setMenuOpen(false);
    } else {
      showErrorMessageToast("Сначала введите запрос");
      searchBarRef.current.focus();
    }
  };

  const handleExtendedSearch = (filters) => {
    setDialogOpen(false);

    const urlParams = new URLSearchParams({
      q: searchValue,
      ...filters
    });
    
    navigate("search?" + urlParams.toString());
  };

  const signUp = () => {
    navigate("sign-up");
  };

  return (
    <>
      <Header>
        <Button className="menu-button" onClick={openMenu}>
          <img src="menu.svg" alt="Меню" />
        </Button>
        <Button className="sign-in-button">Войти</Button>
        {menuOpen && (
          <NavMenu
            setMenuOpen={setMenuOpen}
            openESDialog={handleOpenESDialog}
            header={
              <>
                <Logo />
                <p className="nav-menu-description">
                  Зарегистрируйтесь в БНТУ Умный поиск, чтобы создавать оповещения
                </p>
                <Button type="button" className="nav-menu-signin-button" onClick={signUp}>
                  Регистрация в БНТУ Умный поиск
                </Button>
              </>
            }
          />
        )}
        {dialogOpen && (
          <ExtendedSearchDialog
            dialogState={dialogState}
            setDialogOpen={setDialogOpen}
            setDialogState={setDialogState}
            extendedSearch={handleExtendedSearch}
          />
        )}
      </Header>
      <Body>
        <img src="title.svg" alt="Заголовок сайта" className="title" />
        <RedirectSearchBar
          ref={searchBarRef}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          redirect={handleRedirect}
        />
        <ToastContainer />
      </Body>
    </>
  );
}
