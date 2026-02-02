import { useQuery } from "@tanstack/react-query";
import { fetchFlightById, fetchPrediction, fetchPriceHistory } from "./api";

export const useFlightDetails = (id?: string) =>
  useQuery({
    queryKey: ["flight", id],
    queryFn: () => fetchFlightById(id ?? ""),
    enabled: Boolean(id)
  });

export const usePriceHistory = (id?: string) =>
  useQuery({
    queryKey: ["flight-history", id],
    queryFn: () => fetchPriceHistory(id ?? ""),
    enabled: Boolean(id)
  });

export const usePrediction = (id?: string) =>
  useQuery({
    queryKey: ["flight-prediction", id],
    queryFn: () => fetchPrediction(id ?? ""),
    enabled: Boolean(id)
  });
