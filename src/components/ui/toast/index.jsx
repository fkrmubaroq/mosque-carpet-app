import cn from "classnames";
import dynamic from "next/dynamic";
import { AiOutlineClose } from "react-icons/ai";
import { FiCheck } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";
const Portal = dynamic(
  import("@/components/ui/portal").then((module) => module.default),
  {
    ssr: false,
  }
);

const listVariant = {
  default: "bg-slate-900 text-gray-500",
  danger: "bg-red-700 text-white"
};
export function Toast({
  children,
  show,
  onHide,
  duration = 3000,
  variant = "default",
}) {
  return (
    <Portal>
      <div
        className={cn(
          "fixed left-1/2 z-[9999991] mb-4 flex w-full max-w-xs -translate-x-1/2  items-center overflow-hidden rounded-lg p-4  shadow transition-all duration-300 ease-in-out",
          {
            "bottom-5 ": show,
            "bottom-[-200px]": !show,
          },
          listVariant[variant]
        )}
        role="alert"
      >
        <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
          {variant === "default" ? (
            <FiCheck color="white" size={25} />
          ) : (
            <IoMdCloseCircle size={25} />
          )}
          <span className="sr-only">Check icon</span>
        </div>
        <div
          className={cn("ml-3 text-sm font-normal ", {
            "text-gray-300": variant === "default",
          })}
        >
          {children}
        </div>
        <button
          type="button"
          className={cn(
            "-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5  hover:text-white focus:ring-2  focus:ring-gray-300 ",
            {
              "text-gray-400 hover:bg-gray-800": variant === "default",
              "text-white hover:text-gray-200": variant === "danger",
            }
          )}
          data-dismiss-target="#toast-success"
          aria-label="Close"
        >
          <AiOutlineClose />
        </button>
        {show && (
          <div
            style={{
              animationDuration: `${duration / 1000}s`,
            }}
            onAnimationEnd={() => {
              onHide && onHide();
            }}
            className="animation-move absolute bottom-[0.2px] left-0 h-[3px] bg-transparent"
          ></div>
        )}
      </div>
    </Portal>
  );
}