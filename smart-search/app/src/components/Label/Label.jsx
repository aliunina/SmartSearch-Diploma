import "./Label.css";

export default function Label({ children, required }) {
  return (
    <p className="input-label">
        {children} {required ? <span className="input-label-required">*</span> : ""}
    </p>
  );
}