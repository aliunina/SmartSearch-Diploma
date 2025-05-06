import "./Main.css";

import Header from "../../layouts/CommonLayout/Header/Header";
import Body from "../../layouts/CommonLayout/Body/Body";

import Button from "../../components/inputs/Button/Button";
import ExtendedSearchDialog from "../../components/dialogs/ExtendedSearchDialog/ExtendedSearchDialog";
import RedirectSearchBar from "../../components/inputs/RedirectSearchBar/RedirectSearchBar";
import NavMenu from "../../components/menus/NavMenu/NavMenu";
import BusyIndicator from "../../components/visuals/BusyIndicator/BusyIndicator";

import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useContext } from "react";
import axios from "axios";

import {
  showErrorMessageToast,
  showSuccessMessageToast
} from "../../helpers/util";

import { UserContext } from "../../contexts/UserContext/UserContext";

export default function Main() {
  const { user, setUser } = useContext(UserContext);
  const searchBarRef = useRef();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);

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
    navigate("/sign-in", {
      state: {
        navBack: true
      }
    });
  };

  const openUserProfile = (tab) => {
    navigate("/my-profile", {
      state: {
        tab: tab
      }
    });
  };

  const signOut = () => {
    setBusy(true);
    const serverUrl = import.meta.env.VITE_SERVER_API_URL;
    axios
      .get(serverUrl + "/user/sign-out", {
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
        setBusy(false);
      })
      .catch((response) => {
        console.log(response.data);
        showErrorMessageToast("Произошла ошибка, попробуйте позже.");
        setMenuOpen(false);
        setBusy(false);
      });
  };

  return (
    <>
      {busy && (
        <div className="darkened-background">
          <BusyIndicator />
        </div>
      )}
      <Header className="main-header">
        <Button className="default-button" onClick={openMenu}>
          <img src="menu.svg" alt="Меню" />
        </Button>
        {!user && (
          <div className="main-header-buttons">
            <Button className="accent-button header-sign-in-button" onClick={signIn}>
              Войти
            </Button>          
            <Button
              type="button"
              className="default-button sign-up-button"
              onClick={signUp}
            >
              Зарегистрироваться
            </Button>
          </div>
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
        <p className="main-site-title">
          <Link className="main-site-title-bntu" to="https://bntu.by/">БНТУ </Link>
          <Link className="main-site-title-smart-search" to="/">Умный поиск</Link>
        </p>
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
