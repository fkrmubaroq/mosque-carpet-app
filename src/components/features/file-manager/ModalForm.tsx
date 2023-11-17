import { SpinnerIcon } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import ContainerInput from "@/components/ui/container/ContainerInput";
import { Input } from "@/components/ui/form/input";
import { Modal, ModalBody, ModalFooter, ModalHeader, TTypeModalProps } from "@/components/ui/modal";
import { useState } from "react";
export type TFolderForm = {
  name: string;
  path: string;
};
export default function ModalFormFolder({
  onHide,
  name,
  show,
  isLoading,
  onSave,
}: TTypeModalProps & {
  name: string;
  onSave: (folderName: string) => void;
  isLoading: boolean
}) {
  const [folderName, setFolderName] = useState<string>(name);
  return (
    <Modal
      show={show}
      verticallyCentered
      size="w-[400px]"
      onHide={() => onHide && onHide()}
    >
      <ModalHeader onHide={() => onHide && onHide()}>Buat Folder</ModalHeader>
      <ModalBody>
        <ContainerInput>
          <Input
            autoFocus
            placeholder="Nama Folder"
            className="!h-11"
            name={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </ContainerInput>
        <div className="mt-5 flex justify-end">
          <Button
            size="lg"
            onClick={() => onSave(folderName)}
            disabled={isLoading}
            className="flex items-center justify-center"
          >
            {isLoading ? (
              <SpinnerIcon width="w-4" height="h-4" />
            ) : (
              "Buat Folder"
            )}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}