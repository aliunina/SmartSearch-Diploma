import "./Label.css";

export default function Label({ children, required, ...props }) {
  return (
    <label className="input-label" {...props}>
        {children} {required ? <span className="input-label-required">*</span> : ""}
    </label>
  );
}