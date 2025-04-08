import "./Button.css";

export default function Button({children, hidden, className, ...props}) {
  return (
      <button className={`${hidden ? "button-non-displayed" : ""} ${className}`} {...props}>
        {children}
      </button>
  );
}
