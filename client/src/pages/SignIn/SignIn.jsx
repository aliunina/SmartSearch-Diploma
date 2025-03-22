import "./SignIn.css";

import Body from "../../layouts/CommonLayout/Body/Body";
import Header from "../../layouts/CommonLayout/Header/Header";
import Logo from "../../components/Logo/Logo";
import SignInForm from "../../components/SignInForm/SignInForm";

import axios from "axios";
import { Link } from "react-router-dom";
import { DB_PARAMS } from "../../constants";

export default function SignIn() {
  const signIn = (credentials) => {
    const fetchData = async () => {
      try {
        const response = await axios.post(DB_PARAMS.url + "/authorize/user", credentials);
        console.log(response);
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
        <SignInForm signIn={signIn}></SignInForm>
      </Body>
    </>
  );
}
