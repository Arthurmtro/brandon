import { createContext, useContext } from 'react';
import {
  api,
  PaginatedUsersResponse,
  PaginatedMealResponse,
  SpaResponse,
  PaginatedRestaurantResponse,
  PaginatedReservationResponse,
} from '@repo/client';

interface AdminApiContextType {
  getRestaurants: (query?: {
    page?: number;
  }) => Promise<PaginatedRestaurantResponse>;
  getMeals: (query?: { page?: number }) => Promise<PaginatedMealResponse>;
  getSpas: () => Promise<SpaResponse[]>;
  getClients: (query?: {
    page?: number;
    search?: string;
  }) => Promise<PaginatedUsersResponse>;
  getReservations: (query?: {
    page?: number;
    client?: number;
    date_from?: string;
    date_to?: string;
    meal?: number;
    restaurant?: number;
  }) => Promise<PaginatedReservationResponse>;
}

const AdminApiContext = createContext<AdminApiContextType | undefined>(
  undefined
);

export const AdminApiContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const getRestaurants: AdminApiContextType['getRestaurants'] = async (
    query = {}
  ) =>
    api.restaurants
      .restaurantControllerListRestaurants({
        page: 1,
        ...query,
      })
      .then((r) => r.data);

  const getMeals: AdminApiContextType['getMeals'] = (query = {}) =>
    api.meals
      .mealControllerListMealTypes({
        page: 1,
        ...query,
      })
      .then((r) => r.data);

  const getSpas: AdminApiContextType['getSpas'] = () =>
    api.spas
      .spaControllerGetSpa()
      .then((r) => r.data)
      .then((spas) => Promise.resolve(Array.isArray(spas) ? spas : [spas]));

  const getClients: AdminApiContextType['getClients'] = (query = {}) =>
    api.users
      .userControllerListUsers({
        search: '',
        page: 1,
        ...query,
      })
      .then((r) => r.data);

  const getReservations: AdminApiContextType['getReservations'] = (
    query = {}
  ) =>
    api.reservations
      .reservationControllerListReservations({ page: 1, ...query })
      .then((r) => r.data);

  return (
    <AdminApiContext.Provider
      value={{ getRestaurants, getMeals, getSpas, getClients, getReservations }}
    >
      {children}
    </AdminApiContext.Provider>
  );
};

export const useAdminApiContext = () => {
  const context = useContext(AdminApiContext);
  if (!context) {
    throw new Error(
      'useAdminApiContext doit être utilisé dans un AdminApiContextProvider'
    );
  }
  return context;
};
