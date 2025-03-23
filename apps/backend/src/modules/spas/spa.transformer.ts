import { SpaModel } from '../hotel-california/hotel-california.types';
import { SpaResponse } from './responses/spa.response';

export const transformToSpaResponse = (data: SpaModel): SpaResponse => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    location: data.location,
    phoneNumber: data.phone_number,
    email: data.email,
    openingHours: data.opening_hours,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};
