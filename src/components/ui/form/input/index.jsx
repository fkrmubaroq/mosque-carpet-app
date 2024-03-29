import cn from "classnames";
import { forwardRef } from "react";

const Input = forwardRef(({ className, readOnly, invalid, type, ...props }, ref) => {
    return (
      <>
        <input
          type={type}
          className={cn(
            "text-input",
            "placeholder:text-muted-foreground text-gray-500 focus:text-gray-700 flex h-9 w-full rounded-md border bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus:ring-primary focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
            { "!bg-gray-200": readOnly },
            className
          )}
          ref={ref}
          readOnly={readOnly}
          {...props}
        />
        {invalid && <span className="invalid-feedback">{invalid}</span>}
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };
