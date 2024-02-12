import { create } from "zustand";

export const useDialogStore = create((set) => ({
  // toast
  toast: undefined,
  customMessage: "",
  customVariantToast: "",
  showToast: (toast, message, variant) => set(state => ({
    ...state,
    toast,
    customMessage: toast === "custom-message" ? message : "",
    customVariantToast: variant
  })),
  hideToast: () => set((state) => ({ ...state, toast: undefined })),

  // confirmation
  confirmation: undefined,
  confirmationIsLoading: false,
  confirmMessage: () => null,
  showConfirmation: (confirmation, confirmOptions, message) => set(state => ({
    ...state,
    confirmation,
    customMessage: message,
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

export const useFileManagerStore = create((set) => ({
  currentPath: "/",
  setPath: (path) => set(state => ({ ...state, currentPath: path }))
}))

export const useEditSection = create((set) => ({
  viewIdSection: true,
  setViewIdSection: (status) => set(state => ({ ...state, viewIdSection: status })),
  sectionsLp: [],
  setSectionsLp: (sections) => set(state => ({ ...state, sectionsLp: sections }))
}))
