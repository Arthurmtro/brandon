import {
  ReservationModel,
  ReservationInput,
  ReservationUpdateInput,
  PaginatedReservationResponse as ClientPaginatedResponse,
  ListReservationsParams as ClientListParams,
} from '../hotel-california/hotel-california.types';

import {
  CreateReservationRequest,
  UpdateReservationRequest,
  PatchReservationRequest,
  ListReservationsParams,
} from './requests/reservation.request';

import {
  ReservationResponse,
  PaginatedReservationResponse,
} from './responses/reservation.response';

export const transformRequestToReservation = (
  request: CreateReservationRequest,
): ReservationInput => {
  return {
    client: request.clientId,
    restaurant: request.restaurantId,
    date: request.date,
    meal: request.mealId,
    number_of_guests: request.numberOfGuests,
    special_requests: request.specialRequests,
  };
};

export const transformUpdateRequestToReservation = (
  request: UpdateReservationRequest,
): ReservationInput => {
  return transformRequestToReservation(request);
};

export const transformPatchRequestToReservationUpdate = (
  request: PatchReservationRequest,
): ReservationUpdateInput => {
  const updateInput: ReservationUpdateInput = {};

  if (request.clientId !== undefined) updateInput.client = request.clientId;
  if (request.restaurantId !== undefined)
    updateInput.restaurant = request.restaurantId;
  if (request.date !== undefined) updateInput.date = request.date;
  if (request.mealId !== undefined) updateInput.meal = request.mealId;
  if (request.numberOfGuests !== undefined)
    updateInput.number_of_guests = request.numberOfGuests;
  if (request.specialRequests !== undefined)
    updateInput.special_requests = request.specialRequests;
  if (request.status !== undefined) updateInput.status = request.status;
  if (request.updateReason !== undefined)
    updateInput.update_reason = request.updateReason;
  if (request.notifyClient !== undefined)
    updateInput.notify_client = request.notifyClient;

  return updateInput;
};

export const transformReservationModelToResponse = (
  model: ReservationModel,
): ReservationResponse => {
  return {
    id: model.id,
    clientId: model.client,
    restaurantId: model.restaurant,
    date: model.date,
    mealId: model.meal,
    numberOfGuests: model.number_of_guests,
    specialRequests: model.special_requests,
    status: 'status' in model ? (model['status'] as string) : undefined,
  };
};

export const transformToPaginatedReservationResponse = (
  clientResponse: ClientPaginatedResponse,
): PaginatedReservationResponse => {
  return {
    count: clientResponse.count,
    next: clientResponse.next ?? null,
    previous: clientResponse.previous ?? null,
    results: clientResponse.results.map(transformReservationModelToResponse),
  };
};

export const transformToClientListParams = (
  params: ListReservationsParams,
): ClientListParams => {
  return {
    client: params.clientId,
    restaurant: params.restaurantId,
    meal: params.mealId,
    date_from: params.dateFrom,
    date_to: params.dateTo,
    page: params.page,
  };
};
