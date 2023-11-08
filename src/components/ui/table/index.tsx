import cn from "classnames";
export default function Table({ children }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-500 ">
        {children}        
      </table>
    </div>
  );
}

export function Thead({ children }: React.ComponentPropsWithoutRef<"div">) {
  return <thead className="bg-gray-50 text-xs uppercase text-gray-700 ">
    {children}
  </thead>
}

export function Th({ children, className }: React.ComponentPropsWithoutRef<"div">) {
  return <th scope="col" className={cn("px-6 py-3 h-[55px]", className)}>{children}</th>
}

export function Tr({ children, className }: React.ComponentPropsWithoutRef<"div">) {
  return <tr className={cn("h-[55px] border-b bg-white")}>{children}</tr>;
}
export function Td({ children, className }: React.ComponentPropsWithoutRef<"div">) {
  return <td className={cn("px-6 py-4", className)}>{children}</td>;
}