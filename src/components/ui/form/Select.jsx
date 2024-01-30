import cn from "classnames";
import {
  useMemo,
  useRef,
  useState
} from "react";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";
import { FiSearch as SearchIcon } from "react-icons/fi";
import { PiCaretDownBold, PiCaretUpBold } from "react-icons/pi";
import { SpinnerIcon } from "../Spinner";

import { useOnClickOutside } from "@/lib/hooks";
import Checkbox from "./Checkbox";
import { Input } from "./input";

// Selection [main]
const Selection = ({
  value,
  values,
  placeholder,
  invalid,
  required = false,
  valid,
  enableSearch = true,
  options,
  onClickOption,
  onReset,
  name,
  variant = "no-background",
  onFetchDataFromFilter,
  onListOpened,
  isLoading,
  className,
  customItemSelection,
  title,
  children,
  onClick,
  readOnly,
  classNameToggle
}) => {
  const [opened, setOpened] = useState(false);
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef(null);

  useOnClickOutside(inputRef, () => {
    if (!opened) return;
    setOpened(false);
    setKeyword("");
    onFetchDataFromFilter && onFetchDataFromFilter("");
  });

  const handleClick = (item) => {
    if (!onClickOption) return;
    onClickOption(item);
    setOpened(false);
    setKeyword("");
  };

  const filterData =
    options &&
    options.filter((item) =>
      onFetchDataFromFilter || isLoading
        ? options
        : item.text.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
    );
  const handleChangeKeyword = (e) => {
    onFetchDataFromFilter && onFetchDataFromFilter(e.target.value);
    setKeyword(e.target.value);
  };

  const handleToggle = () => {
    if (readOnly) return;
    onClick && onClick();
    onListOpened && onListOpened();
    setOpened((o) => !o);
  };

  return (
    <div className={cn("relative")}>
      <div className="relative flex flex-col" ref={inputRef}>
        <input
          name={name}
          required={required}
          value={value?.toString()}
          onChange={() => ""}
          onClick={handleToggle}
          className="text-input hidden"
        />

        <div
          title={title}
          onClick={handleToggle}
          className={cn(
            "selection",
            "py-2 pl-4 pr-16",
            "text-sm outline-none",
            "border border-gray-300",
            "cursor-pointer rounded-md",
            "overflow-hidden text-ellipsis whitespace-nowrap break-all",
            className,
            {
              "text-gray-400": (placeholder && !value) || readOnly,
              "text-gray-800": value,
              "bg-gray-50": !readOnly,
              "bg-gray-200": readOnly,
            }
          )}
        >
          {!value ? (readOnly && "-") || placeholder || "Pilih" : value}
        </div>

        {onReset && value && !readOnly && (
          <ResetButton onReset={onReset} variant={variant} />
        )}

        {children ? (
          children
        ) : (
          <>
            {!readOnly && (
              <ToggleOpen
                opened={opened}
                onClick={handleToggle}
                variant={variant}
                className={classNameToggle}
              />
            )}
            <SelectionList
              value={value}
              isLoading={isLoading}
              enableSearch={enableSearch}
              show={opened}
              data={filterData || []}
              onClick={handleClick}
              onChangeKeyword={handleChangeKeyword}
              selectedValues={values}
              customItemSelection={customItemSelection}
            />
          </>
        )}

        <span className="invalid-feedback">{invalid}</span>
        <span className="valid-feedback">{valid}</span>
      </div>
    </div>
  );
};

// Reset Button
const listVariantButton = {
  "no-background": "right-38px",
  default: "right-[3.125rem] bg-slate-900 w-18px h-18px",
};

const listColorSvg = {
  "no-background": "#6B7280",
  default: "white",
};

const ResetButton = ({
  onReset,
  variant = "default",
}) => {
  return (
    <span
      className={cn(
        "h-4 w-4 rounded-full",
        "absolute top-3",
        "flex cursor-pointer items-center justify-center",
        listVariantButton[variant]
      )}
      onClick={() => onReset()}
    >
      <CloseIcon color={listColorSvg[variant]} width="7.5" height="7.5" />
    </span>
  );
};

// Selection List

const SelectionList = ({
  show,
  data,
  onClick,
  enableSearch,
  onChangeKeyword,
  multiple,
  selectedValues,
  isLoading,
  onSelectAll,
  onReset,
  customItemSelection,
  value,
}) => {
  const allIsSelected = useMemo(
    () => selectedValues?.length === data.length,
    [data.length, selectedValues?.length]
  );

  const isSelected = (item) => {
    return (
      multiple && selectedValues?.some((selected) => selected.id === item.id)
    );
  };

  if (!show) return <></>;

  return (
    <div className="absolute inset-x-0 top-10 z-50 rounded-md bg-white pb-2 pt-2 drop-shadow-md">
      {enableSearch && (
        <div className="relative mb-2.5 px-2.5">
          <Input
            className="!h-[37px] !border-gray-300"
            placeholder="Cari Pilihan"
            onChange={onChangeKeyword}
          />
          <div className="absolute right-5 top-2.5">
            <SearchIcon width="15" height="15" color="#6b7280" />
          </div>
        </div>
      )}

      {multiple && onSelectAll && (
        <div className="px- mx-4 my-4 flex justify-between text-xs">
          <div className="flex items-center gap-x-2">
            <Checkbox
              checked={allIsSelected}
              onChange={() => {
                onSelectAll(!allIsSelected);
              }}
              text={<span className="text-xs">Pilih semua</span>}
            />
            {/* <span>Pilih semua</span> */}
          </div>
          {onReset && (
            <span className="cursor-pointer font-medium" onClick={onReset}>
              Reset
            </span>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center gap-x-2">
          <SpinnerIcon width="w-5" height="h-5" />
        </div>
      ) : (
        <>
          {data.length ? (
            <div className="max-h-[400px] overflow-y-auto">
              {data.map((item, key) => (
                <li
                  key={key}
                  className={cn(
                    "group flex cursor-pointer list-none gap-x-3 px-4 text-xs text-slate-600 hover:bg-gray-100",
                    {
                      "bg-gray-100": item.text === value,
                    }
                  )}
                  onClick={() => onClick(item)}
                >
                  {multiple && (
                    <Checkbox
                      className="mt-3.5"
                      checked={isSelected(item) || false}
                      onChange={() => onClick(item)}
                    />
                  )}

                  <div className="flex flex-col py-2 pr-2 group-hover:bg-gray-100">
                    {customItemSelection ? (
                      customItemSelection(item)
                    ) : (
                      <>
                        <span className="font-normal text-gray-900">
                          {item.text}
                        </span>
                        {item?.subText && (
                          <span className="text-sm text-gray-400">
                            {item.subText}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </li>
              ))}
            </div>
          ) : (
            <span className="px-2.5 text-sm text-gray-400">
              Pencarian tidak ditemukan
            </span>
          )}
        </>
      )}
    </div>
  );
};

// Toggle Open
const listVariantToggle = {
  "no-background": "",
  default: "bg-slate-900 rounded-r-md",
};

const colorVariantToggle = {
  "no-background": "#6B7280", // gray-500
  default: "white",
};

const ToggleOpen = ({
  opened,
  onClick,
  variant = "default",
  className
}) => {
  return (
    <div
      className={cn(
        "absolute bottom-0 right-0 top-0 flex h-[2.375rem] w-[2.375rem] cursor-pointer items-center justify-center ",
        listVariantToggle[variant],
        className
      )}
      onClick={onClick}
    >
      {
        !opened ?
        <PiCaretDownBold color={colorVariantToggle[variant]} /> :
        <PiCaretUpBold color={colorVariantToggle[variant]} />
      }
    </div>
  );
};

export { Selection, SelectionList, ToggleOpen };

