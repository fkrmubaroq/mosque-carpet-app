import { Button } from "@/components/ui/button";
import UploadFile from "@/components/ui/form/UploadFile";
import { Modal, ModalBody, ModalHeader } from "@/components/ui/modal";
import { MIME_TYPE_IMAGE } from "@/lib/constant";
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
          placeholder="PNG, JPG, WEBP, GIF, SVG, ICO (Ukuran Maksimal 1Mb)"
          maxFileSizeMb={1}
          accept={Object.keys(MIME_TYPE_IMAGE)}

          onChange={(files, next) => {
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