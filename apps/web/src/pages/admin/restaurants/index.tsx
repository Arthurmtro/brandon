import { RestaurantList } from '@/components/Restaurant/List';
import { Loading } from '@/components/ui/loading';
import {
  RestaurantProvider,
  useRestaurants,
} from '@/context/restaurant.context';

export const metadata = {
  title: 'Our Restaurants | Hotel California',
  description: 'Discover the diverse dining options at Hotel California',
};

export default function RestaurantsPage() {
  const {
    restaurants,
    isLoading,
    error,
    totalCount,
    currentPage,
    fetchRestaurants,
  } = useRestaurants();

  if (isLoading) {
    return <Loading />;
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
    <main className='container mx-auto px-4 py-8'>
      <RestaurantList
        restaurants={restaurants}
        totalCount={totalCount}
        currentPage={currentPage}
      />
    </main>
  );
}
