'use client';
import { useAdminApiContext } from '../../../context/AdminApiContext';
import Paginator from '../../../components/Paginator';
import { useEffect, useState, useId, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { PaginatedUsersResponse, UserResponse } from '@repo/client';
import { useUsers } from '@/context/user.context';
import { debounce } from '../../../../utils/debounce';

export const metadata = {
  title: 'Clients | Hotel California',
  description: 'Manage your clients at Hotel California',
};

export default function ClientsPage() {
  const router = useRouter();
  const baseId = useId();
  const { users, fetchUsers, isLoading, error } = useUsers();

  const [query, setQuery] = useState<{ page: number; search: string }>({
    page: 1,
    search: '',
  });

  const [maxPage, setMaxPage] = useState<number>(1);
  const [minPage, setMinPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState('');

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      handleQueryChange({ ...query, search: searchTerm });
    }, 1000),
    [query]
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleQueryChange = useCallback(
    async (newQuery: { page: number; search: string }) => {
      setQuery(newQuery);
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
    [router, fetchUsers]
  );

  useEffect(() => {
    if (router.isReady) {
      const page = Number(router.query.page) || 1;
      const search = String(router.query.search || '');
      setQuery({ page, search });
      setSearchValue(search);
      fetchUsers(page, search);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {}, [users]);

  return (
    <main className='p-5 bg-white text-black min-h-screen'>
      <div className='text-2xl mb-4'>Clients</div>
      <div>
        <input
          className='w-full my-2 pr-10 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
          value={searchValue}
          type='text'
          onChange={handleSearchInputChange}
          placeholder='Search clients...'
        />
      </div>
      <div className='mt-2'>
        <Paginator
          minPage={minPage}
          maxPage={maxPage}
          page={query.page}
          onPageChange={(page) => handleQueryChange({ ...query, page: page })}
        />
      </div>

      {isLoading ? (
        <div className='flex justify-center my-8'>
          <div className='animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent'></div>
        </div>
      ) : error ? (
        <div className='text-red-500 mt-4'>
          Error loading clients: {error.message}
        </div>
      ) : (
        <div className='mt-4 flex flex-col items-start gap-4'>
          {users.length === 0 ? (
            <div className='text-gray-500'>No clients found</div>
          ) : (
            users.map((client) => (
              <div
                key={`${baseId}-${client.id}`}
                className='flex flex-col items-start gap-1 border border-gray-300 rounded-lg shadow-lg p-4 w-full'
              >
                {Object.keys(client).map((k) => {
                  const key = k as keyof UserResponse;
                  const value = String(client[key]);

                  return (
                    <div
                      key={`${baseId}-${client.id}-${key}`}
                      className='flex flex-row items-start gap-2'
                    >
                      <span className='font-medium'>{key}:</span>
                      <span className='font-bold'>{value}</span>
                    </div>
                  );
                })}
                <button
                  className='mt-3 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors'
                  onClick={() => {
                    router.push(router.pathname + `/${client.id}`);
                  }}
                >
                  EDIT
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
