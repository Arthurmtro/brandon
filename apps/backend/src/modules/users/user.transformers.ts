import {
  ClientInput,
  ClientModel,
  PaginatedClientList,
} from '../hotel-california/hotel-california.types';
import { UserRequest } from './requests/user.request';
import {
  PaginatedUsersResponse,
  UserResponse,
} from './responses/user.response';

/**
 * Transforms API UserRequest model to client snake_case format
 * @param request User request from API
 * @returns Transformed object for client
 */
export const transformUserRequestToClient = (
  request: UserRequest,
): ClientInput => {
  return {
    name: request.name,
    phone_number: request.phoneNumber,
    room_number: request.roomNumber,
    special_requests: request.specialRequests,
  };
};
/**
 * Transforms client snake_case format to API UserResponse model
 * @param data Client response data
 * @returns Transformed UserResponse object
 */
export const transformClientToUserResponse = (
  data: ClientModel,
): UserResponse => {
  return {
    id: data.id,
    name: data.name,
    phoneNumber: data.phone_number,
    roomNumber: data.room_number ?? undefined,
    specialRequests: data.special_requests,
  };
};

/**
 * Transforms client snake_case paginated response to API paginated format
 * @param data Paginated data from client
 * @returns Transformed paginated response
 */
export const transformClientToPaginatedUserResponse = (
  data: PaginatedClientList,
): PaginatedUsersResponse => {
  return {
    count: data.count,
    next: data.next ?? null,
    previous: data.previous ?? null,
    results: Array.isArray(data.results)
      ? data.results.map(transformClientToUserResponse)
      : [],
  };
};
