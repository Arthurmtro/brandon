import { useAdminApiContext } from '../../../context/AdminApiContext';
import Paginator from '../../../utils/Paginator';
import { useEffect, useState, useId } from 'react';
import {
  PaginatedRestaurantList,
  Restaurant,
} from '../../../../../backend/src/clients/hotel-california/api/api';

export default function RestauratsPage() {
  const pageResolution = 10;

  const baseId = useId();

  const { getRestaurants } = useAdminApiContext();

  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [minPage, setMinPage] = useState<number>(1);

  const [restaurants, setRestaurants] = useState<PaginatedRestaurantList>();
  useEffect(() => {
    console.log(`page : ${page}`);
    getRestaurants(page).then(setRestaurants);
  }, [page]);

  useEffect(() => {
    if (restaurants) setMaxPage(~~(restaurants.count / pageResolution) + 1);
  }, [restaurants]);

  // useEffect(() => {
  //   console.log(restaurants);
  // }, [restaurants]);

  return (
    <div className='p-5 bg-white text-black min-h-screen'>
      <div className='text-2xl'>Restaurants</div>
      <div className='mt-2'>
        <Paginator
          minPage={minPage}
          maxPage={maxPage}
          page={page}
          onPageChange={setPage}
        />
      </div>
      <div className='mt-4 flex flex-col items-start gap-4'>
        {restaurants?.results.map((restaurant) => (
          <div
            key={`${baseId}-${restaurant.id}`}
            className='flex flex-col items-start gap-1 border border-gray-300 rounded-lg shadow-lg p-2'
          >
            {Object.keys(restaurant).map((k) => {
              const key = k as keyof Restaurant;
              const value = ['boolean', 'undefined'].includes(
                typeof restaurant[key]
              )
                ? String(restaurant[key])
                : restaurant[key];

              return (
                <div
                  key={`${baseId}-${restaurant.id}-${key}`}
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
