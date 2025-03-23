'use client';

import { useState } from 'react';
import { PlusIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { RestaurantList } from '@/components/restaurant/list';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRestaurants } from '@/context/restaurant.context';
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

  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return <Loading />;
  }

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
            <h1 className='text-3xl font-bold tracking-tight'>Restaurants</h1>
            <p className='text-muted-foreground mt-1'>
              Discover the diverse dining options at Hotel California
            </p>
          </div>
          <Button className='ml-auto'>
            <PlusIcon className='mr-2 h-4 w-4' />
            Add Restaurant
          </Button>
        </div>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle>Our Restaurants</CardTitle>
            <CardDescription>
              {totalCount} dining options available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RestaurantList
              restaurants={restaurants}
              totalCount={totalCount}
              currentPage={currentPage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
