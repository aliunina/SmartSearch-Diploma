import "./SignIn.css";

import Body from "../../layouts/CommonLayout/Body/Body";
import Header from "../../layouts/CommonLayout/Header/Header";
import Logo from "../../components/Logo/Logo";
import SignInForm from "../../components/SignInForm/SignInForm";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { useContext } from "react";
import { showSuccessMessageToast } from "../../helpers/util";
import { DB_PARAMS } from "../../constants";

export default function SignIn() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const signIn = (credentials) => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          DB_PARAMS.url + "/authorize/user",
          credentials
        );
        showSuccessMessageToast("Вход успешно выполнен.");
        setUser(response.data);
        navigate("/");
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
