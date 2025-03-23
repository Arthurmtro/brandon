'use client';

import { api, RestaurantResponse } from '@repo/client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface RestaurantContextProps {
  restaurants: RestaurantResponse[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  currentPage: number;
  fetchRestaurants: (page?: number) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextProps | undefined>(
  undefined
);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<RestaurantResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchRestaurants = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentPage(page);

      const response =
        await api.restaurants.restaurantControllerListRestaurants({
          page,
        });

      const { data, status } = response;
      if (status !== 200) {
        throw new Error('Failed to fetch restaurants');
      }

      setRestaurants(data.results);
      setTotalCount(data.count);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch restaurants')
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const value: RestaurantContextProps = {
    restaurants,
    isLoading,
    error,
    totalCount,
    currentPage,
    fetchRestaurants,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurants() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurants must be used within a RestaurantProvider');
  }
  return context;
}
