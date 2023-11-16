import { create } from "zustand";
import { TKeyToastMessage, TKeyConfirmation } from "./message";

type TConfirm = {
   onConfirm: () => void
}
type TDialogStore = {
  toast: TKeyToastMessage | undefined;
  customMessage: string;
  showToast: (toast: TKeyToastMessage, message?: string) => void;
  hideToast: () => void;


  confirmation: TKeyConfirmation | undefined;
  showConfirmation: (toast: TKeyConfirmation, confirmOptions: TConfirm ) => void;
  hideConfirmation: () => void;
  confirmMessage: () => void;
  confirmationIsLoading: boolean;

}
export const useDialogStore = create<TDialogStore>((set) => ({
  // toast
  toast: undefined,
  customMessage: "",
  showToast: (toast: TKeyToastMessage, message?: string) => set(state => ({
    ...state,
    toast,
    customMessage: toast === "custom-message" ? message : ""
  })),
  hideToast: () => set((state) => ({ ...state, toast: undefined })),

  // confirmation
  confirmation: undefined,
  confirmationIsLoading: false,
  confirmMessage:() => null,
  showConfirmation:(confirmation: TKeyConfirmation, confirmOptions:TConfirm ) => set(state => ({
    ...state,
    confirmation,
    confirmMessage: () => {
      set(state => ({
        ...state,
        confirmationIsLoading: true
      }))
      confirmOptions.onConfirm()
    }
  })),
  hideConfirmation: () => set((state) => ({ ...state, confirmation: undefined, confirmationIsLoading: false })),
 
}))