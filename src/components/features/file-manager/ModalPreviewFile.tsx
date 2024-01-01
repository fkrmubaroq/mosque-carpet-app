import { Button } from "@/components/ui/button";
import UploadFile from "@/components/ui/form/UploadFile";
import {
  Modal,
  ModalBody,
  ModalHeader,
  TTypeModalProps,
} from "@/components/ui/modal";
import { TResponseFileItem } from "@/lib/api/file-manager";
import { DIR_ACCESS_FILE } from "@/lib/constant";
import Image from "next/future/image";

export default function ModalPreviewFile({ data, onHide }: TTypeModalProps & { data: TResponseFileItem}) {
  const src = `${DIR_ACCESS_FILE}${data.path}${data.name}`;
  return (
    <div>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[999] h-full w-full bg-black opacity-20"
        onClick={() => onHide && onHide()}
      ></div>
      <div className="absolute left-1/2 top-10 z-[999] -translate-x-1/2">
        <div className="bg-gray-800">
          <Image
            alt=""
            src={src}
            sizes="100vw"
            width={0}
            height={0}
            style={{ width: "100%", height: "90vh" }}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
