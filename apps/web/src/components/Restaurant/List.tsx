'use client';

import { FC, useState } from 'react';
import { RestaurantResponse } from '@repo/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Clock, MapPin, Users } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from '../ui/pagination';
import { Badge } from '../ui/badge';

interface Props {
  readonly restaurants: RestaurantResponse[];
  readonly totalCount: number;
  readonly currentPage: number;
}

export const RestaurantList: FC<Props> = ({
  restaurants,
  totalCount,
  currentPage,
}) => {
  return (
    <div className='container mx-auto py-8 px-4'>
      <h1 className='text-3xl font-bold mb-6'>Nos Restaurants</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className='h-full'>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <CardTitle className='text-xl'>{restaurant.name}</CardTitle>
                {restaurant.isActive ? (
                  <Badge className='bg-green-500'>Ouvert</Badge>
                ) : (
                  <Badge className='text-red-500 border-red-500'>Fermé</Badge>
                )}
              </div>
              <CardDescription>{restaurant.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2 text-sm'>
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                  <span>{restaurant.openingHours}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <MapPin className='h-4 w-4 text-muted-foreground' />
                  <span>{restaurant.location}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Users className='h-4 w-4 text-muted-foreground' />
                  <span>Capacité: {restaurant.capacity} personnes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href='#'
              onClick={(e) => {
                e.preventDefault();
                // if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
              className={
                currentPage === 1 ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>

          {Array.from({ length: totalCount }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href='#'
                isActive={currentPage === index + 1}
                onClick={(e) => {
                  e.preventDefault();
                  // handlePageChange(index + 1);
                }}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {totalCount > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href='#'
              onClick={(e) => {
                e.preventDefault();
                // if (currentPage < totalCount) handlePageChange(currentPage + 1);
              }}
              className={
                currentPage === totalCount
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
