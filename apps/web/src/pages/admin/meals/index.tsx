import { useAdminApiContext } from '../../../context/AdminApiContext';
import Paginator from '../../../components/Paginator';
import { useEffect, useState, useId } from 'react';
import { PaginatedMealTypeListResponse, MealTypeResponse } from '@repo/client';

export default function MealsPage() {
  const pageResolution = 10;

  const baseId = useId();

  const { getMeals } = useAdminApiContext();

  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [minPage, setMinPage] = useState<number>(1);

  const [meals, setMeals] = useState<PaginatedMealTypeListResponse>();
  useEffect(() => {
    console.log(`page : ${page}`);
    getMeals({ page }).then(setMeals);
  }, [page]);

  useEffect(() => {
    if (meals) setMaxPage(Math.ceil(meals.count / pageResolution));
  }, [meals]);

  // useEffect(() => {
  //   console.log(restaurants);
  // }, [restaurants]);

  return (
    <div className='p-5 bg-white text-black min-h-screen'>
      <div className='text-2xl'>Meals</div>
      <div className='mt-2'>
        <Paginator
          minPage={minPage}
          maxPage={maxPage}
          page={page}
          onPageChange={setPage}
        />
      </div>
      <div className='mt-4 flex flex-col items-start gap-4'>
        {meals?.results.map((meal) => (
          <div
            key={`${baseId}-${meal.id}`}
            className='flex flex-col items-start gap-1 border border-gray-300 rounded-lg shadow-lg p-2'
          >
            {Object.keys(meal).map((k) => {
              const key = k as keyof MealTypeResponse;
              const value = ['boolean', 'undefined'].includes(typeof meal[key])
                ? String(meal[key])
                : meal[key];

              return (
                <div
                  key={`${baseId}-${meal.id}-${key}`}
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
