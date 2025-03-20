import { Link } from "react-router-dom";
import Body from "../../layouts/CommonLayout/Body/Body";
import Header from "../../layouts/CommonLayout/Header/Header";
import "./SignIn.css";
import Logo from "../../components/Logo/Logo";
import SignInForm from "../../components/SignInForm/SignInForm";

export default function SignIn() {
  const signIn = (values) => {

  };

  return (
    <>
      <Header>
        <Link to="/">
          <Logo className="header-logo" />
        </Link>
      </Header>
      <Body>
        <SignInForm signIn={signIn}></SignInForm>
      </Body>
    </>
  );
}
