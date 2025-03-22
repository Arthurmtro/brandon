import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { api, socketApi } from '@repo/client';
import { AdminApiContextProvider } from '../context/AdminApiContext';
import { WebSocketProvider } from '@/context/websocket.context';

api.init({
  api: {
    baseUrl: 'http://localhost:3040',
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AdminApiContextProvider>
      <WebSocketProvider>
        <Component {...pageProps} />
      </WebSocketProvider>
    </AdminApiContextProvider>
  );
}
