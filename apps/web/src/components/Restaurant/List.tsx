'use client';

import { useRestaurants } from '@/context/restaurant.context';
import { useState } from 'react';

export default function RestaurantList() {
  const {
    restaurants,
    isLoading,
    error,
    totalCount,
    currentPage,
    fetchRestaurants,
  } = useRestaurants();
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(
    null
  );

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative'
        role='alert'
      >
        <strong className='font-bold'>Error!</strong>
        <span className='block sm:inline'> {error.message}</span>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold'>Our Restaurants ({totalCount})</h2>

      {restaurants.length === 0 ? (
        <p className='text-gray-500'>No restaurants found.</p>
      ) : (
        <div className='grid md:grid-cols-2 gap-6'>
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className={`border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                selectedRestaurant === restaurant.id
                  ? 'ring-2 ring-primary'
                  : ''
              }`}
              onClick={() => setSelectedRestaurant(restaurant.id)}
            >
              <div className='p-6'>
                <div className='flex justify-between items-start'>
                  <h3 className='text-xl font-semibold'>{restaurant.name}</h3>
                  {restaurant.isActive ? (
                    <span className='px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'>
                      Open
                    </span>
                  ) : (
                    <span className='px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'>
                      Closed
                    </span>
                  )}
                </div>

                <p className='mt-2 text-gray-600'>{restaurant.description}</p>

                <div className='mt-4 text-sm text-gray-500 space-y-1'>
                  <p>
                    <span className='font-medium'>Location:</span>{' '}
                    {restaurant.location}
                  </p>
                  <p>
                    <span className='font-medium'>Hours:</span>{' '}
                    {restaurant.openingHours}
                  </p>
                  <p>
                    <span className='font-medium'>Capacity:</span>{' '}
                    {restaurant.capacity} guests
                  </p>
                </div>

                <button className='mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors'>
                  Make a Reservation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalCount > restaurants.length && (
        <div className='flex justify-center mt-6'>
          <div className='flex space-x-2'>
            <button
              onClick={() => fetchRestaurants(currentPage - 1)}
              disabled={currentPage === 1}
              className='px-4 py-2 border rounded disabled:opacity-50'
            >
              Previous
            </button>
            <span className='px-4 py-2'>Page {currentPage}</span>
            <button
              onClick={() => fetchRestaurants(currentPage + 1)}
              disabled={currentPage * restaurants.length >= totalCount}
              className='px-4 py-2 border rounded disabled:opacity-50'
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
