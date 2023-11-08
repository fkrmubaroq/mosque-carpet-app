import cn from "classnames";
import React, { forwardRef, ForwardedRef } from "react";

type FormProps = {
  validated?: true | false;
  className?: string;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
};

const Form = forwardRef(
  (
    { validated, className, onSubmit, children }: FormProps,
    ref: ForwardedRef<HTMLFormElement>
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
