import cn from "classnames";
import dynamic from "next/dynamic";
import React, { ReactNode } from "react";
import { AiOutlineClose } from "react-icons/ai";
const Portal = dynamic(
  import("@/components/ui/portal").then((module) => module.default),
  {
    ssr: false,
  }
);

export type SchemaModal<TData = {}, TType = {}> = {
  show: boolean;
  type?: TType;
  data?: TData;
};

export type modalAnimationStatus = "running" | "paused";

export type ComponentDivProps = React.ComponentProps<"div">;
export type TTypeModalProps = ComponentDivProps & {
  children?: ReactNode;
  show?: boolean;
  size?: string;
  onHide?: () => void;
  title?: string;
  showClose?: boolean;
  verticallyCentered?: boolean;
};
export function Modal({
  children,
  show,
  size = "md",
  onHide,
  className,
  title,
  onMouseOver,
  onMouseOut,
  showClose = false,
  verticallyCentered = false
}: TTypeModalProps) {
  const modalSize = {
    [size]: size,
    md: "max-w-[31.25rem]",
    lg: "max-w-[40.625rem]",
    xl: "max-w-[62rem]",
    xxl: "max-w-[85.375rem]",
  };

  if (!show) return null;
  return (
    <Portal>
      <div
        className={cn("fixed top-0 z-50 h-full w-full overflow-y-auto bg-transparent px-2 font-jasans",
          {
          "flex justify-center items-center": verticallyCentered
        })}
        onMouseOver={(e) => onMouseOver && onMouseOver(e)}
        onMouseOut={(e) => onMouseOut && onMouseOut(e)}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 h-full w-full bg-black opacity-20"
          onClick={() => onHide && onHide()}
        ></div>

        {/* Content */}
        <div
          className={cn(
            "animate-scale relative mx-auto my-5 min-w-[20rem] rounded-lg bg-white",
            modalSize[size],
            className
          )}
        >
          {title && (
            <ModalHeader onHide={() => onHide && onHide()}>{title}</ModalHeader>
          )}
          {showClose && (
            <div className="absolute right-4 top-4">
              <CloseBtnModal onHide={() => onHide && onHide()} />
            </div>
          )}

          <div>{children}</div>
        </div>
      </div>
    </Portal>
  );
}
// Modal Body
type PropsModalBody = {
  children: React.ReactNode;
  className?: string;
};
export function ModalBody({ children, className }: PropsModalBody) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

// Modal Header
type PropsModalHeader = {
  children: React.ReactNode;
  onHide: () => void;
};

const variantHeader = { 
  primary: "bg-primary text-white"
}
export function ModalHeader({
  variant = "primary",
  className,
  children,
  onHide,
}: React.ComponentPropsWithoutRef<"div"> & PropsModalHeader & { variant?: keyof typeof variantHeader}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-t-lg border-b p-4",
        className,
        variantHeader[variant]
      )}
    >
      <h3 className="tracking-wide">{children}</h3>
      <CloseBtnModal onHide={onHide} />
    </div>
  );
}

// Close Btn
type CloseBtnProps = {
  onHide: () => void;
};
function CloseBtnModal({ onHide }: CloseBtnProps) {
  return (
    <div className="cursor-pointer" onClick={onHide}>
      <AiOutlineClose size={15} color="white" />
    </div>
  );
}

// Modal Footer
type ModalFooterProps = {
  children: React.ReactNode;
  className?: string;
};
export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center space-x-2 rounded-b border-t border-gray-200 p-5",
        className
      )}
    >
      {children}
    </div>
  );
}
