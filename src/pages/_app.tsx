import "@/styles/index.scss";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useDialogStore } from "@/lib/hookStore";
import { Toast } from "@/components/ui/toast";
import { TOAST_MESSAGE } from "@/lib/message";
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
  const [toast, hideToast] = useDialogStore((state) => [
    state.toast,
    state.hideToast,
  ]);

  return (
    <Toast onHide={hideToast} show={!!toast}>
      {!!toast && TOAST_MESSAGE[toast]}
    </Toast>
  );
}