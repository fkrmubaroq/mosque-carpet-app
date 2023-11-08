import cn from "classnames";
import React, { CSSProperties, ChangeEvent, FC, useRef } from "react";
type Props = {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  invalid?: string;
  valid?: string;
  name?: string;
  autoSize?: boolean;
  maxHeight?: number;
  style?: CSSProperties;
  disabled?: boolean;
};

const Textarea: FC<Props> = ({
  value,
  onChange,
  placeholder,
  className,
  required,
  invalid,
  valid,
  name,
  style,
  autoSize,
  disabled,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initHeight = useRef<number>(0);

  const setAutoSize = () => {
    if (!inputRef.current) return;
    if (!initHeight.current) {
      initHeight.current = parseInt(
        getComputedStyle(inputRef.current).getPropertyValue("height")
      );
    }
    inputRef.current.style.height = `${initHeight.current}px`;

    if (
      autoSize &&
      inputRef.current &&
      inputRef.current.scrollHeight > initHeight.current
    ) {
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoSize && setAutoSize();
    onChange && onChange(e);
  };

  return (
    <>
      <textarea
        ref={inputRef}
        style={style}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className={cn(
          "text-input",
          "w-full resize-none px-4 py-2 text-sm outline-none",
          "rounded-md border border-gray-300  text-gray-500 focus:border-primary focus:bg-white focus:text-gray-900",
          className,
          {
            "bg-gray-50": !disabled,
            "bg-gray-200": disabled
          }
        )}
        required={required}
        name={name}
      />
      {invalid && <span className="invalid-feedback !mt-0">{invalid}</span>}
      {valid && <span className="valid-feedback !mt-0">{valid}</span>}
    </>
  );
};

export default Textarea;
