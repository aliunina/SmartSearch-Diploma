import "./Main.css";

import Header from "../../layouts/CommonLayout/Header/Header";
import Body from "../../layouts/CommonLayout/Body/Body";
import Button from "../../components/Button/Button";
import ExtendedSearchDialog from "../../components/ExtendedSearchDialog/ExtendedSearchDialog";

import RedirectSearchBar from "../../components/RedirectSearchBar/RedirectSearchBar";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useContext } from "react";
import NavMenu from "../../components/NavMenu/NavMenu";
import { showErrorMessageToast, showSuccessMessageToast } from "../../helpers/util";
import { UserContext } from "../../contexts/UserContext/UserContext";
import axios from "axios";
import { SERVER_PARAMS } from "../../constants";

export default function Main() {
  const { user, setUser } = useContext(UserContext);
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
      navigate("/search?" + urlParams.toString());
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

    navigate("/search?" + urlParams.toString());
  };

  const signUp = () => {
    navigate("/sign-up");
  };

  const signIn = () => {
    navigate("/sign-in");
  };

  const openUserProfile = (tab = 0) => {
    navigate("/my-profile", {
      state: {
        tab
      }
    });
    
  const signOut = () => {
    axios
      .get(SERVER_PARAMS.url + "/user/sign-out", {
        withCredentials: true
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(null);
          showSuccessMessageToast("Вы вышли из аккаунта.");
        } else {
          showErrorMessageToast("Произошла ошибка, попробуйте еще раз.");
        }
        setMenuOpen(false);
      })
      .catch((response) => {
        console.log(response.data);
        showErrorMessageToast("Произошла ошибка, попробуйте позже.");
        setMenuOpen(false);
      });
  };

  return (
    <>
      <Header className="main-header">
        <Button className="menu-button" onClick={openMenu}>
          <img src="menu.svg" alt="Меню" />
        </Button>
        {!user && (
          <Button className="sign-in-button" onClick={signIn}>
            Войти
          </Button>
        )}
        {menuOpen && (
          <NavMenu
            setMenuOpen={setMenuOpen}
            openESDialog={handleOpenESDialog}
            signUp={signUp}
            openUserProfile={openUserProfile}
            signOut={signOut}
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
      </Body>
    </>
  );
}
