import { createContext, useContext } from 'react';
import {
  api,
  PaginatedClientListResponse,
  PaginatedMealTypeListResponse,
  SpaResponse,
  PaginatedRestaurantListResponse,
} from '@repo/client';

interface AdminApiContextType {
  getRestaurants: (query?: {
    page?: number;
  }) => Promise<PaginatedRestaurantListResponse>;
  getMeals: (query?: {
    page?: number;
  }) => Promise<PaginatedMealTypeListResponse>;
  getSpas: () => Promise<SpaResponse[]>;
  getClients: (query?: {
    page?: number;
    search?: string;
  }) => Promise<PaginatedClientListResponse>;
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
    { page } = { page: 1 }
  ) =>
    api.restaurants
      .restaurantControllerListRestaurants({
        page,
      })
      .then((r) => r.data);

  const getMeals: AdminApiContextType['getMeals'] = ({ page } = { page: 1 }) =>
    api.meals
      .mealControllerListMealTypes({
        page,
      })
      .then((r) => r.data);

  const getSpas: AdminApiContextType['getSpas'] = () =>
    api.spas
      .spaControllerGetSpaInfo()
      .then((r) => r.data)
      .then((spas) => Promise.resolve(Array.isArray(spas) ? spas : [spas]));

  const getClients: AdminApiContextType['getClients'] = (
    { page, search } = { page: 1, search: '' }
  ) =>
    api.users
      .userControllerGetClients({
        search: search || '',
        page: String(page || 1),
      })
      .then((r) => r.data);

  return (
    <AdminApiContext.Provider
      value={{ getRestaurants, getMeals, getSpas, getClients }}
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
