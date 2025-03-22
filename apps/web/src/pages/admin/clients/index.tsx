import { useAdminApiContext } from '../../../context/AdminApiContext';
import Paginator from '../../../components/Paginator';
import { useEffect, useState, useId } from 'react';
import { PaginatedClientListResponse, ClientResponse } from '@repo/client';

export default function ClientsPage() {
  const pageResolution = 10;

  const baseId = useId();

  const { getClients } = useAdminApiContext();

  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [minPage, setMinPage] = useState<number>(1);

  const [search, setSearch] = useState('');

  const [clients, setClients] = useState<PaginatedClientListResponse>();

  useEffect(() => {
    console.log(`page : ${page}`);
    getClients({ page, search }).then(setClients).catch(console.log);
  }, [page, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (clients) setMaxPage(Math.ceil(clients.count / pageResolution));
    console.log(clients);
  }, [clients]);

  return (
    <div className='p-5 bg-white text-black min-h-screen'>
      <div className='text-2xl'>Clients</div>
      <div>
        <input
          className='w-full my-2 pr-10 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
          value={search}
          type='text'
          onChange={(e) => setSearch(e.target.value)}
          placeholder='search'
        ></input>
      </div>
      <div className='mt-2'>
        <Paginator
          minPage={minPage}
          maxPage={maxPage}
          page={page}
          onPageChange={setPage}
        />
      </div>
      <div className='mt-4 flex flex-col items-start gap-4'>
        {clients?.results.map((client) => (
          <div
            key={`${baseId}-${client.id}`}
            className='flex flex-col items-start gap-1 border border-gray-300 rounded-lg shadow-lg p-2'
          >
            {Object.keys(client).map((k) => {
              const key = k as keyof ClientResponse;
              const value = String(client[key]);

              return (
                <div
                  key={`${baseId}-${client.id}-${key}`}
                  className='flex flex-row items-start gap-1'
                >
                  {key} :<span className='font-bold'>{value}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
