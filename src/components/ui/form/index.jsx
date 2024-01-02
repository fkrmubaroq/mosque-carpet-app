import cn from "classnames";
import { forwardRef } from "react";

const Form = forwardRef(
  (
    { validated, className, onSubmit, children },
    ref
  ) => {
    return (
      <form
        onSubmit={onSubmit}
        ref={ref}
        noValidate
        className={cn(className, {
          "form-validated": validated,
        })}
      >
        {children}
      </form>
    );
  }
);

Form.displayName = "Form";

export default Form;
