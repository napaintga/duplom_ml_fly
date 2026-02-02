import { http } from "../../shared/api/http";
import { endpoints } from "../../shared/api/endpoints";
import type { Ticket } from "../../shared/api/types";

export type TicketFilters = {
  flightId?: string;
  from?: string;
  to?: string;
};

export const fetchTickets = async (filters?: TicketFilters) => {
  const response = await http.get<Ticket[]>(endpoints.tickets, {
    params: filters
  });
  return response.data;
};
