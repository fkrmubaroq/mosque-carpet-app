import cn from "classnames";
import React, { ComponentPropsWithoutRef, useRef } from "react";
import { BsCheckLg } from "react-icons/bs";
import style from "./Checkbox.module.scss";

const defaultColorChecked = {
  checked: "white",
  uncheck: "#4b5563",
};
type TCheckbox = "md" | "lg";

type PropsCheckbox = ComponentPropsWithoutRef<"div"> & {
  checked?: boolean;
  onChange?: () => void;
  text?: string | React.ReactNode;
  size?: TCheckbox
};

const sizeList: Record< TCheckbox, string> = {
  md: "w-5 h-5",
  lg: "w-6 h-6"
}
export default function Checkbox({
  checked,
  onChange,
  text,
  className,
  size="md"
}: PropsCheckbox) {
  const inputRef = useRef<HTMLInputElement>(null);
  const checkedWithoutOnChangeRef = useRef<boolean>(checked || false);

  const setCheckedMark = (el: Element, status: boolean) => {
    if (status) {
      el.classList.add("border-primary", "!bg-primary");
      el.querySelector("svg")?.setAttribute("style", `color:${defaultColorChecked.checked}`);
      return;
    }

    el.querySelector("svg")?.setAttribute("style", `color:${defaultColorChecked.uncheck}`);
    el.classList.remove("!bg-primary", "border-primary");
  };
  const handleChange = (e: React.MouseEvent) => {
    // cheked when without onChange
    if (!onChange && inputRef.current) {
      const checkedRef = !checkedWithoutOnChangeRef.current;
      inputRef.current.checked = checkedRef;
      checkedWithoutOnChangeRef.current = checkedRef;
      const labelEl = inputRef.current.nextElementSibling;
      if (!labelEl) return;
      const checkedMarkEl = labelEl.querySelector("div");
      if (!checkedMarkEl) return;

      setCheckedMark(checkedMarkEl, checkedRef);
      return;
    }
    e.stopPropagation();
    if (!inputRef.current) return;
    inputRef.current.click();
    onChange && onChange();
  };

  return (
    <span className={style["checkbox"]}>
      <input
        ref={inputRef}
        type="checkbox"
        className={cn("hidden", style["checkbox__input"])}
        checked={checked}
        onChange={() => {}}
      />
      <label
        className={cn("relative flex cursor-pointer items-center gap-x-2", {
          [style["checkbox__label"]]: !onChange,
        })}
        onClick={handleChange}
      >
        <div
          className={cn(
            "relative block shrink-0 cursor-pointer rounded border border-gray-300 bg-gray-100",
            {
              "border-primary !bg-primary": checked,
            },
            className,
            sizeList[size]
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center",
              style["checkbox__icon"],
              {
                "opacity-0": !checked,
              }
            )}
          >
            <BsCheckLg
              size={17}
              color={
                checked
                  ? defaultColorChecked.checked
                  : defaultColorChecked.uncheck
              }
            />
          </div>
        </div>
        {text ? <span className="text-sm">{text}</span> : ""}
      </label>
    </span>
  );
}
