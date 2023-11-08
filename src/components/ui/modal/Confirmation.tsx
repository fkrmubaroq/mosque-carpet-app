import { Modal, ModalBody, ModalFooter, ModalHeader } from ".";
import { Button } from "../button";

export function Confirmation() {
  return (
    <Modal show verticallyCentered>
      <ModalHeader className="!border-none px-7 pt-5 pb-0">
        <span className="font-semibold text-lg">Are you absolutely sure?</span>
      </ModalHeader>
      <ModalBody className="pt-2 text-sm text-gray-500 px-7 pb-6">
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      <div className="flex justify-end gap-x-2 mt-5">
        <Button variant="ghost" size="lg">Batal</Button>
        <Button size="lg">Ya</Button>
      </div>
      </ModalBody>
    </Modal>
  );
}