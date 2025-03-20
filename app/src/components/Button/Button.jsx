import "./Button.css";

export default function Button({children, hidden, className, ...props}) {
  return (
      <button className={`${className} ${hidden ? "button-non-displayed" : ""}`} {...props}>
        {children}
      </button>
  );
}
