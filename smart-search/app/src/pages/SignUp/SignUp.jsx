import "./SignUp.css";
import Header from "../../layouts/SignUpLayout/Header/Header";
import Logo from "../../components/Logo/Logo";
import { Link } from "react-router-dom";
import Body from "../../layouts/SignUpLayout/Body/Body";
import LeftPanel from "../../layouts/SignUpLayout/LeftPanel/LeftPanel";
import RightPanel from "../../layouts/SignUpLayout/RightPanel/RightPanel";
import SignUpStep from "../../components/SignUpStep/SignUpStep";

export default function SignUp() {
  return (
    <>
      <Header>
        <Link to="/">
          <Logo className="sign-up-header-logo"/>
        </Link>
      </Header>
      <Body>
        <LeftPanel>
          <div className="sign-up-steps">
            <SignUpStep
              title="Личные данные"
              active={true}
              description="Введите свое имя и электронную почту."
            />
            <SignUpStep
              title="Выберите пароль"
              active={false}
              description="Минимальная длина пароля 8 символов."
            />
            <SignUpStep
              title="О себе"
              active={false}
              description="Добавьте информацию о своем месте работы, области интересов, стране проживания."
            />
          </div>
        </LeftPanel>
        <RightPanel />
      </Body>
    </>
  );
}
