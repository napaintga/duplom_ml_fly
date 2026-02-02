import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FlightCard } from "../features/flights/components/FlightCard";
import { FlightSearchForm } from "../features/flights/components/FlightSearchForm";
import { useFlights } from "../features/flights/hooks";
import { Spinner } from "../shared/ui/Spinner";

export const FlightsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || undefined;
  const { data, isLoading, isError } = useFlights(query);

  const flights = useMemo(() => data ?? [], [data]);

  const handleSearch = (value?: string) => {
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Flights</h1>
        <p className="text-sm text-slate-500">
          Search the latest fares and predicted opportunities.
        </p>
      </div>
      <FlightSearchForm defaultQuery={query} onSearch={handleSearch} />
      {isLoading && <Spinner />}
      {isError && (
        <p className="text-sm text-red-500">
          Unable to load flights. Please try again later.
        </p>
      )}
      {!isLoading && flights.length === 0 && (
        <p className="text-sm text-slate-500">No flights found.</p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>
    </div>
  );
};
