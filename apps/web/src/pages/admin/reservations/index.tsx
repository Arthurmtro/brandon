import { useEffect, useState, useId } from 'react';
import { useRouter } from 'next/router';
import { useAdminApiContext } from '../../../context/AdminApiContext';
import Paginator from '../../../components/Paginator';
import {
  PaginatedReservationResponse,
  ReservationResponse,
} from '@repo/client';

export default function ReservationsPage() {
  const pageResolution = 10;

  const router = useRouter();

  const baseId = useId();

  const { getReservations } = useAdminApiContext();

  const [query, setQuery] = useState<{
    page: number;
    client?: number;
    date_from?: string;
    date_to?: string;
    meal?: number;
    restaurant?: number;
  }>({ page: 1 });

  const [maxPage, setMaxPage] = useState<number>(1);
  const [minPage, setMinPage] = useState<number>(1);

  const [reservations, setReservations] =
    useState<PaginatedReservationResponse>();

  useEffect(() => {
    getReservations(query).then(setReservations).catch(console.log);
  }, [query]);

  useEffect(() => {
    if (reservations)
      setMaxPage(Math.ceil(reservations.count / pageResolution));
    console.log(reservations);
  }, [reservations]);

  return (
    <div className='p-5 bg-white text-black min-h-screen'>
      <div className='text-2xl'>Reservations</div>
      <div>
        <input
          className='w-full my-2 pr-10 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
          value={query.client}
          type='number'
          onChange={(e) =>
            setQuery((prevQuery) => {
              return {
                ...prevQuery,
                page: 1,
                client: Number.parseInt(e.target.value),
              };
            })
          }
          placeholder='client'
        ></input>
        <input
          className='w-full my-2 pr-10 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
          value={query.date_from}
          type='text'
          onChange={(e) =>
            setQuery((prevQuery) => {
              return { ...prevQuery, page: 1, date_from: e.target.value };
            })
          }
          placeholder='date_from : YYYY-MM-DD'
        ></input>
        <input
          className='w-full my-2 pr-10 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
          value={query.date_to}
          type='text'
          onChange={(e) =>
            setQuery((prevQuery) => {
              return { ...prevQuery, page: 1, date_to: e.target.value };
            })
          }
          placeholder='date_to : YYYY-MM-DD'
        ></input>
        <input
          className='w-full my-2 pr-10 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
          value={query.meal}
          type='number'
          onChange={(e) =>
            setQuery((prevQuery) => {
              return {
                ...prevQuery,
                page: 1,
                meal: Number.parseInt(e.target.value),
              };
            })
          }
          placeholder='meal'
        ></input>
        <input
          className='w-full my-2 pr-10 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
          value={query.restaurant}
          type='number'
          onChange={(e) =>
            setQuery((prevQuery) => {
              return {
                ...prevQuery,
                page: 1,
                restaurant: Number.parseInt(e.target.value),
              };
            })
          }
          placeholder='restaurant'
        ></input>
      </div>
      <div className='mt-2'>
        <Paginator
          minPage={minPage}
          maxPage={maxPage}
          page={query.page}
          onPageChange={(page) =>
            setQuery((prevQuery) => {
              return { ...prevQuery, page };
            })
          }
        />
      </div>
      <div className='mt-4 flex flex-col items-start gap-4'>
        {reservations?.results.map((reservation) => (
          <div
            key={`${baseId}-${reservation.id}`}
            className='flex flex-col items-start gap-1 border border-gray-300 rounded-lg shadow-lg p-2'
          >
            {Object.keys(reservation).map((k) => {
              const key = k as keyof ReservationResponse;
              const value = String(reservation[key]);

              return (
                <div
                  key={`${baseId}-${reservation.id}-${key}`}
                  className='flex flex-row items-start gap-1'
                >
                  {key} :<span className='font-bold'>{value}</span>
                </div>
              );
            })}
            <div
              onClick={() => {
                router.push(router.pathname + `/${reservation.id}`);
              }}
            >
              EDIT
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
