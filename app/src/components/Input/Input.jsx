import { forwardRef } from "react";
import "./Input.css";
import cn from "classnames";

const Input = forwardRef(function Input(
  { children, className, valid = true, ...props },
  ref
) {
  return (
    <div className="input-container">
      <input
        ref={ref}
        className={cn({
          ["input-invalid"]: !valid
        }, className, "input")}
        {...props}
      />
      {children}
    </div>
  );
});
export default Input;
