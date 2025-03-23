import RestaurantList from '@/components/Restaurant/List';
import { RestaurantProvider } from '@/context/restaurant.context';

export const metadata = {
  title: 'Our Restaurants | Hotel California',
  description: 'Discover the diverse dining options at Hotel California',
};

export default function RestaurantsPage() {
  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Our Restaurants</h1>
      <p className='text-lg text-gray-600 mb-8'>
        Discover our world-class dining options, from casual bistros to fine
        dining experiences. Each restaurant offers a unique ambiance and menu,
        carefully crafted by our award-winning chefs.
      </p>

      <RestaurantList />
    </main>
  );
}
