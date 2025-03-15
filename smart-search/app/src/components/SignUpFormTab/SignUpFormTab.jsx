import "./SignUpFormTab.css";

export default function SignUpFormTab({ icon, title, titleDetails, children }) {
  return (
    <div className="sign-up-form-container">
        <div className="sign-up-form-header">
            <img src={icon}/>
            <p className="sign-up-form-title">{title}</p>
            <p className="sign-up-form-title-details">{titleDetails}</p>
        </div>
        <div className="sign-up-form-body">
            {children}
        </div>
    </div>
  );
}