// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { api } from '@repo/client';
import { AdminApiContextProvider } from '../context/AdminApiContext';
import { WebSocketProvider } from '@/context/websocket.context';
import { RestaurantProvider } from '@/context/restaurant.context';
import { UserProvider } from '@/context/user.context';
import { composeProviders } from '../../utils/compose-providers';

api.init({
  api: {
    baseUrl: 'http://localhost:3040',
  },
});

const Providers = composeProviders([
  AdminApiContextProvider,
  RestaurantProvider,
  UserProvider,
  WebSocketProvider,
]);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}
