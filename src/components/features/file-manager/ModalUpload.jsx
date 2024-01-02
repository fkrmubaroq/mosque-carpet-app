import { Button } from "@/components/ui/button";
import UploadFile from "@/components/ui/form/UploadFile";
import { Modal, ModalBody, ModalHeader } from "@/components/ui/modal";
import { useState } from "react";

export default function ModalUploadFile({ onUpload, onHide }) {
  const [selectedFile, setSelectedFile] = useState();

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