import "./SignUp.css";
import Header from "../../layouts/CommonLayout/Header/Header";
import Logo from "../../components/Logo/Logo";
import Body from "../../layouts/CommonLayout/Body/Body";
import LeftPanel from "../../layouts/SignUpLayout/LeftPanel/LeftPanel";
import RightPanel from "../../layouts/SignUpLayout/RightPanel/RightPanel";
import SignUpStep from "../../components/SignUpStep/SignUpStep";
import SignUpForm from "../../components/SignUpForm/SignUpForm";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { DB_PARAMS } from "../../constants";
import { showErrorMessageToast, showSuccessMessageToast } from "../../helpers/util";

export default function SignUp() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

  const signUp = (values) => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          DB_PARAMS.url + "/register/user",
          values
        );
        if (response.status === 200) {
          showSuccessMessageToast("Регистрация успешна.");
          navigate(-1);
        } else if (response.status === 400) {
          showErrorMessageToast("Пользователь с таким email уже существует.");
        }
      } catch (error) {
        console.log("Error while fetching data.");
        console.log(error);
      }
    };
    fetchData();
  };

  return (
    <>
      <Header>
        <Link to="/">
          <Logo className="header-logo" />
        </Link>
      </Header>
      <Body>
        <LeftPanel>
          <div className="sign-up-steps">
            <SignUpStep
              title="Личные данные"
              active={selectedTab === 0}
              description="Введите свое имя и электронную почту."
            />
            <SignUpStep
              title="Выберите пароль"
              active={selectedTab === 1}
              description="Минимальная длина пароля 8 символов."
            />
            <SignUpStep
              title="О себе"
              active={selectedTab === 2}
              description="Добавьте информацию о своем месте работы, области интересов, стране проживания."
            />
          </div>
        </LeftPanel>
        <RightPanel>
          <SignUpForm
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            signUp={signUp}
          />
        </RightPanel>
      </Body>
    </>
  );
}
