import { Button } from "@/components/ui/button";
import ContainerInput from "@/components/ui/container/ContainerInput";
import UploadFile from "@/components/ui/form/UploadFile";
import { Modal, ModalBody, ModalHeader } from "@/components/ui/modal";
import { MIME_TYPE_IMAGE } from "@/lib/constant";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

export default function ModalThumbnail({ show, onHide, onSave }) {
  const [thumbnail, setThumbnail] = useState();
  return <Modal show={show} onHide={onHide}>
    <ModalHeader onHide={onHide}>Ganti Thumbnail</ModalHeader>
    <ModalBody>
      <ContainerInput className="mb-3">
        <Label>Thumbnail</Label>
        <UploadFile
          maxFileSizeMb={1.5}
          onChange={(file, next) => {
            next && next(file);
            setThumbnail(file[0]);
          }}
          placeholder="Thumbnail harus bertipe PNG, JPG, WEBP, GIF (Ukuran Maksimal 1.5Mb)"
          accept={Object.keys(MIME_TYPE_IMAGE)}
          />
      </ContainerInput>
      <Button disabled={!thumbnail} className="w-full" size="lg" onClick={() => {
        if (!thumbnail) return
        onSave(thumbnail);
      }}>Ganti</Button>
    </ModalBody>
  </Modal>
}