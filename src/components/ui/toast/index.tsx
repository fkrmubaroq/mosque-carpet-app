import dynamic from "next/dynamic";
import { AiOutlineClose } from "react-icons/ai";
import { FiCheck } from "react-icons/fi";
import cn from "classnames";
const Portal = dynamic(
  import("@/components/ui/portal").then((module) => module.default),
  {
    ssr: false,
  }
);
export function Toast({ children, show, onHide, duration=2000  }: React.ComponentPropsWithoutRef<"div"> & {
  show: boolean,
  onHide: () => void,
  duration?: number
}) {
  return (
    <Portal>
      <div
        className={cn(
          "fixed left-1/2 z-50 mb-4 flex w-full max-w-xs  -translate-x-1/2 items-center overflow-hidden rounded-lg bg-slate-900 p-4 text-gray-500 shadow transition-all duration-300 ease-in-out",
          {
            "bottom-5 ": show,
            "bottom-[-200px]": !show,
          }
        )}
        role="alert"
      >
        <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
          <FiCheck color="white" />
          <span className="sr-only">Check icon</span>
        </div>
        <div className="ml-3 text-sm font-normal text-gray-300">{children}</div>
        <button
          type="button"
          className="hover:text-whitefocus:ring-2 -mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 focus:ring-gray-300 "
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
            className="animation-move absolute bg-transparent bottom-[0.2px] left-0 h-[3px]"
          ></div>
        )}
      </div>
    </Portal>
  );
}