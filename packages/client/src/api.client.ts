import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
import { Configuration } from "./client";
// These imports would be automatically generated from your OpenAPI spec
import {
  ReservationsApi,
  SpaApi,
  UsersApi,
  RestaurantsApi,
  MealsApi,
  AgentApi,
} from "./client";

// This object would be auto-generated from your OpenAPI spec
export const API_CLIENTS = {
  users: UsersApi,
  spas: SpaApi,
  reservations: ReservationsApi,
  restaurants: RestaurantsApi,
  meals: MealsApi,
  agents: AgentApi,
};

// Generated type for all APIs
export type ApiEndpoints = {
  [K in keyof typeof API_CLIENTS]: InstanceType<(typeof API_CLIENTS)[K]>;
};

// Generated config type
export interface ApiConfig {
  api: {
    baseUrl: string;
  };
}

const baseOptions: CreateAxiosDefaults = {
  // withCredentials: true,
};

/**
 * API client for accessing endpoints generated from OpenAPI specifications
 */
export class ApiClient {
  private http: AxiosInstance;
  private endpoints: ApiEndpoints;

  constructor() {
    this.http = axios.create(baseOptions);
    this.initializeEndpoints();
  }

  private initializeEndpoints(): void {
    this.endpoints = Object.entries(API_CLIENTS).reduce((acc, [key, ApiClass]) => {
      acc[key as keyof typeof API_CLIENTS] = new ApiClass(
        undefined,
        undefined,
        this.http
      );
      return acc;
    }, {} as ApiEndpoints);
  }

  /**
   * Initialize the client with configuration
   */
  public init(config: ApiConfig): void {
    this.http = axios.create({
      ...baseOptions,
      baseURL: config.api.baseUrl,
    });

    this.endpoints = Object.entries(API_CLIENTS).reduce(
      (result, [name, ApiClass]) => {
        result[name as keyof typeof API_CLIENTS] = new ApiClass(
          new Configuration(),
          config.api.baseUrl,
          this.http
        );
        return result;
      },
      {} as ApiEndpoints
    );
  }

  /**
   * Access API endpoints through proxy to avoid needing manual getters
   */
  public get api(): ApiEndpoints {
    return new Proxy(this.endpoints, {
      get: (target, prop) => {
        const key = prop as keyof typeof API_CLIENTS;
        if (key in target) {
          return target[key];
        }
        throw new Error(`API endpoint "${String(prop)}" not found`);
      }
    });
  }

  // For backward compatibility with existing code
  get users() {
    return this.endpoints.users;
  }

  get spas() {
    return this.endpoints.spas;
  }

  get reservations() {
    return this.endpoints.reservations;
  }

  get restaurants() {
    return this.endpoints.restaurants;
  }

  get meals() {
    return this.endpoints.meals;
  }

  get agents() {
    return this.endpoints.agents;
  }
}

// Default client instance for easy import
export const api = new ApiClient();

/**
 * Create a new client instance with optional configuration
 */
export function createApiClient(config?: ApiConfig): ApiClient {
  const client = new ApiClient();
  if (config) {
    client.init(config);
  }
  return client;
}