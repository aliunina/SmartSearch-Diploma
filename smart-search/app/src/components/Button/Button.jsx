import "./Button.css";

export default function Button({children, className, ...props}) {
  return (
      <button className={className} {...props}>
        {children}
      </button>
  );
}
