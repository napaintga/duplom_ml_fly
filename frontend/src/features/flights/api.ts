import { http } from "../../shared/api/http";
import { endpoints } from "../../shared/api/endpoints";
import type { Flight } from "../../shared/api/types";

export const fetchFlights = async (query?: string) => {
  const response = await http.get<Flight[]>(endpoints.flights, {
    params: query ? { q: query } : undefined
  });
  return response.data;
};
