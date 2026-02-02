import { useQuery } from "@tanstack/react-query";
import { fetchTickets, type TicketFilters } from "./api";

export const useTickets = (filters?: TicketFilters) =>
  useQuery({
    queryKey: ["tickets", filters],
    queryFn: () => fetchTickets(filters)
  });
