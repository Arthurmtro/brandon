'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUsers } from '@/context/user.context';
import { UserList } from '@/components/users/list';
import { debounce } from '@/utils/debounce';
import { useRouter } from 'next/router';

export const metadata = {
  title: 'Our Clients | Hotel California',
  description: 'Manage all clients at Hotel California',
};

export default function ClientsPage() {
  const router = useRouter();
  const baseId = useId();
  const { users, fetchUsers, isLoading, error, totalCount, currentPage } =
    useUsers();

  // État pour le contrôle du champ de recherche
  const [searchInputValue, setSearchInputValue] = useState('');

  // Créer la fonction debounce une seule fois
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      const newQuery = {
        page: 1,
        search: searchTerm,
      };

      router.push(
        {
          pathname: '/admin/clients',
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );

      fetchUsers(newQuery.page, newQuery.search);
    }, 500),
    [router]
  );

  // Gérer le changement de page
  const handlePageChange = useCallback(
    (newPage: number) => {
      const newQuery = {
        page: newPage,
        search: (router.query.search as string) || '',
      };

      router.push(
        {
          pathname: '/admin/clients',
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );

      fetchUsers(newQuery.page, newQuery.search);
    },
    [router]
  );

  // Gérer le changement dans l'input de recherche
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
    debouncedSearch(value);
  };

  // Initialisation et synchronisation avec l'URL
  useEffect(() => {
    if (router.isReady) {
      const search = String(router.query.search || '');
      const page = Number(router.query.page) || 1;

      setSearchInputValue(search);
      fetchUsers(page, search);
    }
  }, [router.isReady, router.query.page, router.query.search]);

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Card className='border-red-200 bg-red-50'>
          <CardContent className='pt-6'>
            <div className='flex items-center text-red-700'>
              <span className='font-bold mr-2'>Error:</span>
              <span>{error.message}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='mx-auto px-4 py-6'>
      <div className='flex flex-col space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Clients</h1>
            <p className='text-muted-foreground mt-1'>
              Manage all client accounts and profiles
            </p>
          </div>
          <Button className='ml-auto'>
            <PlusIcon className='mr-2 h-4 w-4' />
            Add Client
          </Button>
        </div>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle>Our Clients</CardTitle>
            <CardDescription>{totalCount} registered clients</CardDescription>
            <div className='flex items-center space-x-2 mt-4'>
              <div className='relative flex-1'>
                <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Search clients...'
                  className='pl-8'
                  value={searchInputValue}
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <UserList
              clients={users}
              totalCount={totalCount}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
