import { Link } from "react-router-dom";
import Body from "../../layouts/CommonLayout/Body/Body";
import Header from "../../layouts/CommonLayout/Header/Header";
import "./Recovery.css";
import Logo from "../../components/Logo/Logo";
import RecoveryForm from "../../components/RecoveryForm/RecoveryForm";

export default function Recovery() {

  return (
    <>
      <Header>
        <Link to="/">
          <Logo className="header-logo" />
        </Link>
      </Header>
      <Body>
        <RecoveryForm/>
      </Body>
    </>
  );
}
