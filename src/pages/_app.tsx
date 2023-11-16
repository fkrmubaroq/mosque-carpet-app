import "@/styles/index.scss";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useDialogStore } from "@/lib/hookStore";
import { Toast } from "@/components/ui/toast";
import { CONFIRMATION_MESSAGE, TOAST_MESSAGE } from "@/lib/message";
import { Confirmation } from "@/components/ui/modal/Confirmation";
import { useShallow } from "zustand/react/shallow";
const queryClient = new QueryClient({});

export default function App({ Component, pageProps }: AppProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools />
      <ToastMessage />      
    </QueryClientProvider>
  );
}


function ToastMessage() {
  const [
    customMessage,
    toast,
    hideToast,
    confirmation,
    hideConfirmation,
    confirmMessage,
    confirmationIsLoading,
  ] = useDialogStore(
    useShallow((state) => [
      state.customMessage,
      state.toast,
      state.hideToast,
      state.confirmation,
      state.hideConfirmation,
      state.confirmMessage,
      state.confirmationIsLoading,
    ])
  );
  return (
    <>
      <Toast
        onHide={hideToast}
        show={!!toast}
        variant={toast?.startsWith("error-") ? "danger" : "default"}
      >
        {!!toast && toast !== "custom-message" && TOAST_MESSAGE[toast]}
        {!!toast && toast === "custom-message" && customMessage}
      </Toast>
      <Confirmation
        show={!!confirmation}
        onHide={hideConfirmation}
        onConfirm={confirmMessage}
        isLoading={confirmationIsLoading}
      >
        {!!confirmation && CONFIRMATION_MESSAGE[confirmation]}
      </Confirmation>
    </>
  );
}