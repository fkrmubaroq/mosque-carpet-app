import { create } from "zustand";
import { TKeyToastMessage } from "./message";

type TDialogStore = {
  toast: TKeyToastMessage | undefined;
  showToast: (toast: TKeyToastMessage) => void;
  hideToast: () => void;
}
export const useDialogStore = create<TDialogStore>((set) => ({
  toast: undefined,
  showToast: (toast: TKeyToastMessage) => set(state => ({
    ...state,
    toast
  })),
  hideToast: () => set((state) => ({ ...state, toast: undefined }))
  
}))