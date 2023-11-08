import { Dispatch, SetStateAction, createContext, useCallback, useMemo, useState } from "react";
import { Toast } from "../ui/toast";
import { TOAST_MESSAGE, TKeyToastMessage } from "@/lib/message";


type TDialog = {
  toast: TKeyToastMessage | undefined ;
  setToast: Dispatch<SetStateAction<TKeyToastMessage | undefined>>;
};

export const DialogContextStore = createContext<TDialog>({} as TDialog);

export default function DialogContextWrapper({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<TKeyToastMessage>();
  const onHide = useCallback(() => setToast(undefined), []);
  const providerValue: TDialog = useMemo(() => ({ toast, setToast }), [toast, setToast]);
  return (
    <DialogContextStore.Provider value={providerValue}>
      {children}

      <Toast
        onHide={onHide}
        show={!!toast}
      >
        {!!toast && TOAST_MESSAGE[toast]}
      </Toast>
    </DialogContextStore.Provider>
  );
}