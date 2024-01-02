import { Confirmation } from "@/components/ui/modal/Confirmation";
import { Toast } from "@/components/ui/toast";
import { useDialogStore } from "@/lib/hookStore";
import { CONFIRMATION_MESSAGE, TOAST_MESSAGE } from "@/lib/message";
import "@/styles/index.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useShallow } from "zustand/react/shallow";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }) {

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
    customVariantToast,
    toast,
    hideToast,
    confirmation,
    hideConfirmation,
    confirmMessage,
    confirmationIsLoading,
  ] = useDialogStore(
    useShallow((state) => [
      state.customMessage,
      state.customVariantToast,
      state.toast,
      state.hideToast,
      state.confirmation,
      state.hideConfirmation,
      state.confirmMessage,
      state.confirmationIsLoading,
    ])
    );
  
  const getVariant = () => {
    if (!customVariantToast) {
      return toast?.startsWith("error-") ? "danger" : "default"
    }
    return customVariantToast;
  }
  return (
    <>
      <Toast
        onHide={hideToast}
        show={!!toast}
        variant={getVariant()}
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
        {!!confirmation && confirmation !== "costum-message" && CONFIRMATION_MESSAGE[confirmation]}
        {!!confirmation && confirmation === "costum-message" && customMessage}
      </Confirmation>
    </>
  );
}