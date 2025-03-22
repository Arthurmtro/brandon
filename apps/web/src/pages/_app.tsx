import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { api, socketApi } from "@repo/client";
import { AdminApiContextProvider } from "../utils/AdminApiContext";

api.init({
  api: {
    baseUrl: "http://localhost:3030",
  },
});
socketApi.chat.init({
  socket: {
    baseUrl: "http://localhost:3030",
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AdminApiContextProvider>
      <Component {...pageProps} />
    </AdminApiContextProvider>
  );
}
