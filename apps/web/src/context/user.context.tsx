'use client';

import { api, UserRequest, UserResponse } from '@repo/client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface UserContextProps {
  users: UserResponse[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  currentPage: number;
  searchQuery: string;
  fetchUsers: (page?: number, search?: string) => Promise<void>;
  createUser: (userData: UserRequest) => Promise<UserResponse>;
  updateUser: (id: string, userData: UserRequest) => Promise<UserResponse>;
  deleteUser: (id: string) => Promise<void>;
  getUser: (id: string) => Promise<UserResponse>;
  validateId: (id: string) => number;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchUsers = async (page: number = 1, search: string = '') => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentPage(page);
      setSearchQuery(search);

      const response = await api.users.userControllerListUsers({
        page,
        search,
      });

      const { data, status } = response;
      if (status !== 200) {
        throw new Error('Failed to fetch users');
      }

      setUsers(data.results);
      setTotalCount(data.count);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: UserRequest): Promise<UserResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.users.userControllerCreateUser({
        userRequest: userData,
      });

      const { data, status } = response;
      if (status !== 201) {
        throw new Error('Failed to create user');
      }

      fetchUsers(currentPage, searchQuery);

      return data;
    } catch (err) {
      console.error('Error creating user:', err);
      const error =
        err instanceof Error ? err : new Error('Failed to create user');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (
    id: string,
    userData: UserRequest
  ): Promise<UserResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const numericId = validateId(id);

      const response = await api.users.userControllerUpdateUser({
        id: numericId,
        userRequest: userData,
      });

      const { data, status } = response;
      if (status !== 200) {
        throw new Error('Failed to update user');
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === numericId ? data : user))
      );

      return data;
    } catch (err) {
      console.error('Error updating user:', err);
      const error =
        err instanceof Error ? err : new Error('Failed to update user');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error('Invalid user ID format');
      }

      const response = await api.users.userControllerDeleteUser({
        id: numericId,
      });

      const { status } = response;
      if (status !== 204) {
        throw new Error('Failed to delete user');
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== numericId)
      );
      setTotalCount((prevCount) => prevCount - 1);
    } catch (err) {
      console.error('Error deleting user:', err);
      const error =
        err instanceof Error ? err : new Error('Failed to delete user');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUser = async (id: string): Promise<UserResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error('Invalid user ID format');
      }

      const response = await api.users.userControllerGetUser({
        id: numericId,
      });

      const { data, status } = response;
      if (status !== 200) {
        throw new Error('Failed to get user');
      }

      return data;
    } catch (err) {
      console.error('Error getting user:', err);
      const error =
        err instanceof Error ? err : new Error('Failed to get user');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const validateId = (id: string): number => {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error('Invalid user ID format');
    }
    return numericId;
  };

  const value: UserContextProps = {
    users,
    isLoading,
    error,
    totalCount,
    currentPage,
    searchQuery,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    validateId,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
}
