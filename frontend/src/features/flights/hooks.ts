import { useQuery } from "@tanstack/react-query";
import { fetchFlights } from "./api";

export const useFlights = (query?: string) =>
  useQuery({
    queryKey: ["flights", query],
    queryFn: () => fetchFlights(query)
  });
