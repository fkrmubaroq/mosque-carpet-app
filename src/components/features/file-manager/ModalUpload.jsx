import { SpinnerIcon } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import UploadFile from "@/components/ui/form/UploadFile";
import { Modal, ModalBody, ModalHeader } from "@/components/ui/modal";
import { MIME_TYPE_IMAGE } from "@/lib/constant";
import { useSetting } from "@/lib/hooks";
import { useState } from "react";

export default function ModalUploadFile({ onUpload, onHide, isLoading }) {
  const [selectedFile, setSelectedFile] = useState();
  const { data: setting } = useSetting();
  return (
    <Modal show size="w-[700px]" onHide={onHide}>
      <ModalHeader onHide={() => onHide && onHide()}>Upload File </ModalHeader>
      <ModalBody>
        <UploadFile
          multiple
          className="max-h-[500px] min-h-[350px]"
          placeholder="PNG, JPG, WEBP, GIF, SVG, ICO (Ukuran Maksimal 1Mb)"
          maxFileSizeMb={setting?.max_upload_file_size_in_mb || 1}
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
          disabled={isLoading}
        >
          {isLoading ? <SpinnerIcon width="w-4" height="h-4" /> : "Upload"}
        </Button>
      </ModalBody>
    </Modal>
  );
}