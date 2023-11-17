import { create } from "zustand";
import { TKeyToastMessage, TKeyConfirmation } from "./message";
import { TVariantToast } from "@/components/ui/toast";

type TConfirm = {
   onConfirm: () => void
}
type TDialogStore = {
  toast: TKeyToastMessage | undefined;
  customMessage: string;
  customVariantToast: TVariantToast | "";
  showToast: (toast: TKeyToastMessage, message?: string, variant?:TVariantToast) => void;
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
  customVariantToast: "",
  showToast: (toast: TKeyToastMessage, message?: string, variant?:TVariantToast) => set(state => ({
    ...state,
    toast,
    customMessage: toast === "custom-message" ? message : "",
    customVariantToast:variant
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

type TFileManagerStore = {
  currentPath: string;
  setPath: (path:string) => void
}

export const useFileManagerStore = create<TFileManagerStore>((set) => ({
  currentPath: "/",
  setPath: (path:string) => set(state => ({ ...state, currentPath:path }))
}))