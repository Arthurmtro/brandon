import {
  RestaurantModel,
  PaginatedRestaurantResponse as ClientPaginatedResponse,
} from '../hotel-california/hotel-california.types';

import {
  RestaurantResponse,
  PaginatedRestaurantResponse,
} from './responses/restaurant.response';

export const transformRestaurantToResponse = (
  model: RestaurantModel,
): RestaurantResponse => {
  return {
    id: model.id,
    name: model.name,
    description: model.description,
    capacity: model.capacity,
    openingHours: model.opening_hours,
    location: model.location,
    isActive: model.is_active !== undefined ? model.is_active : true,
  };
};

export const transformToPaginatedRestaurantResponse = (
  clientResponse: ClientPaginatedResponse,
): PaginatedRestaurantResponse => {
  return {
    count: clientResponse.count,
    next: clientResponse.next ?? null,
    previous: clientResponse.previous ?? null,
    results: clientResponse.results.map(transformRestaurantToResponse),
  };
};
