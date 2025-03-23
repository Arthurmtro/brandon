import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
import { ApiConfig } from './config.types';
import {
  Configuration,
  ReservationsApi,
  SpaApi,
  UsersApi,
  RestaurantsApi,
  MealsApi,
} from './client';

const API_CLIENTS = {
  users: UsersApi,
  spas: SpaApi,
  reservations: ReservationsApi,
  restaurants: RestaurantsApi,
  meals: MealsApi,
};

type Apis = {
  [K in keyof typeof API_CLIENTS]: InstanceType<(typeof API_CLIENTS)[K]>;
};

const baseOptions: CreateAxiosDefaults = {
  // withCredentials: true,
};

class ApiClient {
  private http: AxiosInstance;
  private apis: Apis;

  constructor() {
    this.http = axios.create(baseOptions);
    this.apis = Object.entries(API_CLIENTS).reduce((acc, [key, Api]) => {
      acc[key as keyof typeof API_CLIENTS] = new Api(
        undefined,
        undefined,
        this.http
      ) as any;
      return acc;
    }, {} as Apis);
  }

  public init(config: ApiConfig) {
    this.http = axios.create({
      ...baseOptions,
      baseURL: config.api.baseUrl,
    });

    this.apis = Object.entries(API_CLIENTS).reduce(
      (result, [name, ApiClass]) => {
        result[name as keyof typeof API_CLIENTS] = new ApiClass(
          new Configuration(),
          config.api.baseUrl,
          this.http
        ) as any;

        return result;
      },
      {} as Apis
    );
  }

  get users() {
    return this.apis.users;
  }

  get spas() {
    return this.apis.spas;
  }

  get reservations() {
    return this.apis.reservations;
  }

  get restaurants() {
    return this.apis.restaurants;
  }

  get meals() {
    return this.apis.meals;
  }
}

export const api = new ApiClient();
