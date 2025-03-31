import "./Profile.css";
import { UserContext } from "../../contexts/UserContext/UserContext";

import Body from "../../layouts/CommonLayout/Body/Body";
import Header from "../../layouts/CommonLayout/Header/Header";
import Logo from "../../components/Logo/Logo";

import { useContext } from "react";
import { Link } from "react-router-dom";

export default function Profile() {  
  const {user} = useContext(UserContext);

  return (
    <>
      <Header>
        <Link to="/">
          <Logo className="header-logo" />
        </Link>
      </Header>
      <Body>
        
      </Body>
    </>
  );
}
