import "./FilterItem.css";

export default function FilterItem({ name, text, ...props }) {
  return (
    <div className="filter-item">
      <input id={name} type="radio" className="filter-radio" {...props} />
      <label htmlFor={name} className="filter-label">
        {text}
      </label>
    </div>
  );
}
