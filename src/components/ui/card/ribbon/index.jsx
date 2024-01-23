import cn from "classnames";

const styleRibbonWrapper = {
  primary: "before:border-primary-hover after:border-primary-hover",
  secondary: "before:border-secondary after:border-secondary-hover",
  blue: "before:border-blue-600 after:border-blue-600",
  red: "before:border-red-600 after:border-red-600",
  gray: "before:border-gray-600 after:border-gray-600",
};

const styleRibbonText = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  blue: "bg-blue-500",
  red: "bg-red-500",
  gray: "bg-gray-500",
}
export default function Ribbon({ text, variant = "primary" }) {
  return <div className={cn("absolute h-28 w-28 -top-2 -right-2 ",
    "before:absolute before:left-0 before:top-[-1px] before:border-4 ",
    "after:absolute after:right-[-1px] after:bottom-0 after:border-4 overflow-hidden after:z-[1]",
    styleRibbonWrapper[variant]
  )}>
    <div className={cn(styleRibbonText[variant], "text-white rotate-45 -right-10 absolute top-8 text-xs py-1 text-center w-[180px] z-10")}>{text}</div>
    </div>
}