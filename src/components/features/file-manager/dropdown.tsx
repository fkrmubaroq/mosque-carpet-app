import { GoPlus } from "react-icons/go";
import { LuUpload } from "react-icons/lu";

export default function DropdownFileManager({
  onCreateFolder,
  onUploadFile,
}: {
  onCreateFolder: () => void;
  onUploadFile: () => void;
}) {
  return (
    <nav className="absolute right-0 top-11 flex w-56 flex-col gap-y-2 rounded-md bg-white py-2 shadow">
      <DropdownItem
        text="Buat Folder"
        icon={<GoPlus size={20} />}
        onClick={onCreateFolder}
      />
      <DropdownItem
        text="Upload File"
        icon={<LuUpload size={17} />}
        onClick={onUploadFile}
      />
    </nav>
  );
}

function DropdownItem({
  text,
  icon,
  onClick,
}: {
  onClick: () => void; 
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div 
      className="flex cursor-pointer items-center gap-x-2 px-3 py-2 text-gray-600 hover:bg-gray-200" 
      onClick={() => onClick()}
    >
      <div className="flex h-6 w-6 items-center justify-center">{icon}</div>
      <span>{text}</span>
    </div>
  );
}
