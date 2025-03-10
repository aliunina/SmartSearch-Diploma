import "./Main.css";
import Header from "../../layouts/MainPage/Header/Header";
import Body from "../../layouts/MainPage/Body/Body";
import Button from "../../components/Button/Button";

import RedirectSearchBar from "../../components/RedirectSearchBar/RedirectSearchBar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Main() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleRedirect = (searchValue) => {
    const urlParams = new URLSearchParams({
      q: searchValue
    });
    navigate("search?" + urlParams.toString());
  };

  return (
    <div>
      <Header>       
        <Button className="menu-button">
          <img src="menu.svg" alt="Меню"/>
        </Button>       
        <Button className="sign-in-button">
          Войти
        </Button>
      </Header>
      <Body>
        <img src="title.svg" alt="Заголовок сайта" className="title"/>
        <RedirectSearchBar searchValue={searchValue} setSearchValue={setSearchValue} redirect={handleRedirect}/>
      </Body>
    </div>
  );
}
