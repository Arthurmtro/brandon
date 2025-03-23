import {
  MealTypeModel,
  PaginatedMealTypeResponse,
} from '../hotel-california/hotel-california.types';
import { MealResponse, PaginatedMealResponse } from './responses/meal.response';

export const transformClientToMealResponse = (
  data: MealTypeModel,
): MealResponse => {
  return {
    id: data.id,
    name: data.name,
  };
};

export const transformClientToPaginatedMealResponse = (
  data: PaginatedMealTypeResponse,
): PaginatedMealResponse => {
  return {
    count: data.count,
    next: data.next ?? null,
    previous: data.previous ?? null,
    results: data.results.map(transformClientToMealResponse),
  };
};
