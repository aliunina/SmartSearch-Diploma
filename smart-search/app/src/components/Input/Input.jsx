import "./Input.css";

export default function Input({ children, ...props }) {
  return (
    <div className="input-container">
      <input className="input" {...props} />
      {children}
    </div>
  );
}
