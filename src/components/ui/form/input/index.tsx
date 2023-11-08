import * as React from "react";

import cn from "classnames";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?:string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, type, ...props }, ref) => {
    return (
      <div>
        <input
          type={type}
          className={cn(
            "text-input",
            "placeholder:text-muted-foreground flex h-9 w-full rounded-md border !bg-gray-50 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium hover:!bg-white focus:ring-primary focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {invalid && <span className="invalid-feedback">{invalid}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
