import "./Logo.css";

export default function Logo({...props}) {
  return (
    <img src="logo.svg" alt="Логотип" {...props}/>
  );
}
