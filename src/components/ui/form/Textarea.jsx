import cn from "classnames";
import { useEffect, useRef } from "react";

const Textarea = ({
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
  const inputRef = useRef(null);
  const initHeight = useRef(0);

  useEffect(() => {
    if (!inputRef.current) return;
    setAutoSize();
  }, []);
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

  const handleChange = (e) => {
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
          "rounded-md border border-gray-300 text-gray-500 focus:border-primary focus:bg-white focus:text-gray-900",
          className,
          {
            "bg-white": !disabled,
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
