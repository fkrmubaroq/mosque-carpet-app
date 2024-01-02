import { Button } from "@/components/ui/button";
import UploadFile from "@/components/ui/form/UploadFile";
import { Modal, ModalBody, ModalHeader, TTypeModalProps } from "@/components/ui/modal";
import { useState } from "react";

export default function ModalUploadFile({ onUpload, onHide }: TTypeModalProps & {
  onUpload: (files: FileList) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<FileList >();

  return (
    <Modal show size="w-[700px]" onHide={onHide}>
      <ModalHeader onHide={() => onHide && onHide()}>Upload File </ModalHeader>
      <ModalBody>
        <UploadFile
          multiple
          className="max-h-[500px] min-h-[350px]"
          placeholder="PNG, JPG, WEBP, GIF (Ukuran Maksimal 1Mb)"
          maxFileSizeMb={1}
          accept={[
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
          ]}
          onChange={(files, next) => {
            console.log("inchange ", files);
            next && next(files);
            if (!files) return;
            setSelectedFile(files);
          }}
        />
        <Button
          size="lg"
          className="mt-3 w-full"
          onClick={() => selectedFile && onUpload(selectedFile)}
        >
          Upload
        </Button>
      </ModalBody>
    </Modal>
  );
}