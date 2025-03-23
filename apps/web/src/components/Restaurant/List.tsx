'use client';

import { FC, useState } from 'react';
import { RestaurantResponse } from '@repo/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Clock, MapPin, Users, Edit, Trash2, Eye } from 'lucide-react';
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
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

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
    <div className='w-full space-y-4'>
      <Table className='border rounded-md'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>ID</TableHead>
            <TableHead className='w-[250px]'>Restaurant</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Horaires</TableHead>
            <TableHead>Capacité</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {restaurants.map((restaurant) => (
            <TableRow key={restaurant.id}>
              <TableCell className='font-medium'>{restaurant.id}</TableCell>
              <TableCell>
                <div className='flex items-center gap-3'>
                  <Avatar className='h-9 w-9'>
                    <AvatarFallback className='bg-primary/10 text-primary'>
                      {restaurant.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='font-semibold'>{restaurant.name}</div>
                    <div className='text-xs text-muted-foreground line-clamp-1'>
                      {restaurant.description}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <MapPin className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>{restaurant.location}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>{restaurant.openingHours}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Users className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>{restaurant.capacity} places</span>
                </div>
              </TableCell>
              <TableCell>
                {restaurant.isActive ? (
                  <Badge
                    variant='default'
                    className='bg-green-500 hover:bg-green-600'
                  >
                    Ouvert
                  </Badge>
                ) : (
                  <Badge
                    variant='outline'
                    className='text-red-500 border-red-500 hover:bg-red-50'
                  >
                    Fermé
                  </Badge>
                )}
              </TableCell>
              <TableCell className='text-right'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                      <span className='sr-only'>Ouvrir menu</span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-4 w-4'
                      >
                        <circle cx='12' cy='12' r='1' />
                        <circle cx='12' cy='5' r='1' />
                        <circle cx='12' cy='19' r='1' />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className='mr-2 h-4 w-4' />
                      <span>Voir les détails</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className='mr-2 h-4 w-4' />
                      <span>Modifier</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='text-red-600'>
                      <Trash2 className='mr-2 h-4 w-4' />
                      <span>Supprimer</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {restaurants.length === 0 && (
        <div className='flex justify-center items-center py-8 text-muted-foreground'>
          Aucun restaurant trouvé
        </div>
      )}

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

          {Array.from({ length: Math.min(5, totalCount) }).map((_, index) => (
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

          {totalCount > 5 && (
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
