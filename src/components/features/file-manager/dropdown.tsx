import { GoPlus } from "react-icons/go";
import { LuUpload } from "react-icons/lu";

export default function DropdownFileManager() {
  return (
    <nav className="absolute right-0 top-11 flex w-56 flex-col gap-y-2 rounded-md bg-white py-2 shadow">
      <DropdownItem text="Buat Folder" icon={<GoPlus size={20}/>} />
      <DropdownItem text="Upload File" icon={<LuUpload size={17} />} />
    </nav>
  );
}

function DropdownItem({ text,icon }: { text: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-x-2 px-3 py-2 text-gray-600 cursor-pointer hover:bg-gray-200">
      <div className="w-6 h-6 flex justify-center items-center">{icon}</div>
      <span>{text}</span>
    </div>
  );
}
