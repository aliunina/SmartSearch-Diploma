import "./Main.css";
import Header from "../../layouts/MainPage/Header/Header";
import Body from "../../layouts/MainPage/Body/Body";
import Button from "../../components/Button/Button";

import RedirectSearchBar from "../../components/RedirectSearchBar/RedirectSearchBar";

export default function Main() {
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
        <RedirectSearchBar/>
      </Body>
    </div>
  );
}
