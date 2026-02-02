import { endpoints } from "../../shared/api/endpoints";
import { http, mlHttp } from "../../shared/api/http";
import { env } from "../../app/config/env";
import type { Flight, Prediction, PricePoint } from "../../shared/api/types";

export const fetchFlightById = async (id: string) => {
  const response = await http.get<Flight>(endpoints.flightById(id));
  return response.data;
};

export const fetchPriceHistory = async (id: string) => {
  const response = await http.get<PricePoint[]>(endpoints.flightHistory(id));
  return response.data;
};

export const fetchPrediction = async (id: string) => {
  const client = env.enableDirectMl ? mlHttp : http;
  const response = await client.get<Prediction>(endpoints.predict(id));
  return response.data;
};
