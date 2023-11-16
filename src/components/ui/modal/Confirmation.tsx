import { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from ".";
import { Button } from "../button";
import { SpinnerIcon } from "../Spinner";
import { sleep } from "@/lib/utils";

export function Confirmation({
  onHide,
  show,
  onConfirm,
  children,
  isLoading=false,
}: {
  onHide: () => void;
  show: boolean;
  onConfirm: () => void;
  children: React.ReactNode;
  isLoading: boolean;
  }) {
  
  console.log("isloading ", isLoading)
  return (
    <Modal show={show} onHide={() => onHide && onHide()} verticallyCentered>
      <ModalHeader
        onHide={() => onHide && onHide()}
        className="!border-none px-7 pb-0 pt-5"
      >
        <span className="text-lg font-semibold">Konfirmasi</span>
      </ModalHeader>
      <ModalBody className="px-7 pb-6 pt-2 text-sm text-gray-500">
        {children}
        <div className="mt-5 flex justify-end gap-x-2">
          <Button variant="ghost" size="lg" onClick={() => onHide && onHide()}>
            Batal
          </Button>
          <Button
            className="flex items-center justify-center"
            disabled={isLoading}
            size="lg"
            onClick={() => {
              if (!onConfirm) return;
              onConfirm();
            }}
          >
            {isLoading ? <SpinnerIcon width="w-4" height="h-4" /> : "Ya"}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}