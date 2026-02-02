import { useState } from "react";
import {
  TicketFilters as TicketFiltersComponent
} from "../features/tickets/components/TicketFilters";
import { TicketTable } from "../features/tickets/components/TicketTable";
import { useTickets } from "../features/tickets/hooks";
import type { TicketFilters } from "../features/tickets/api";
import { Spinner } from "../shared/ui/Spinner";

export const TicketsPage = () => {
  const [filters, setFilters] = useState<TicketFilters>({});
  const { data, isLoading, isError } = useTickets(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tickets</h1>
        <p className="text-sm text-slate-500">
          Review tickets and filter by flight or purchase date.
        </p>
      </div>
      <TicketFiltersComponent defaultValues={filters} onApply={setFilters} />
      {isLoading && <Spinner />}
      {isError && (
        <p className="text-sm text-red-500">
          Unable to load tickets. Please try again later.
        </p>
      )}
      {!isLoading && (data?.length ?? 0) === 0 && (
        <p className="text-sm text-slate-500">No tickets found.</p>
      )}
      {data && data.length > 0 && <TicketTable tickets={data} />}
    </div>
  );
};
