import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { PriceHistoryChart } from "../features/flight-details/components/PriceHistoryChart";
import { PredictionPanel } from "../features/flight-details/components/PredictionPanel";
import {
  useFlightDetails,
  usePrediction,
  usePriceHistory
} from "../features/flight-details/hooks";
import { Card } from "../shared/ui/Card";
import { Spinner } from "../shared/ui/Spinner";
import { formatDateTime } from "../shared/utils/format";

export const FlightDetailsPage = () => {
  const { id } = useParams();
  const flightQuery = useFlightDetails(id);
  const historyQuery = usePriceHistory(id);
  const predictionQuery = usePrediction(id);

  const history = useMemo(() => historyQuery.data ?? [], [historyQuery.data]);
  const latestActual = history.length ? history[history.length - 1]?.price : undefined;

  if (flightQuery.isLoading) {
    return <Spinner />;
  }

  if (flightQuery.isError || !flightQuery.data) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-500">
          Unable to load flight details. Please try again.
        </p>
        <Link className="text-sm font-semibold text-blue-600" to="/flights">
          Back to flights
        </Link>
      </div>
    );
  }

  const flight = flightQuery.data;

  return (
    <div className="space-y-6">
      <Link className="text-sm font-semibold text-blue-600" to="/flights">
        ← Back to flights
      </Link>
      <Card className="space-y-2">
        <h1 className="text-2xl font-semibold">
          {flight.origin} → {flight.destination}
        </h1>
        <p className="text-sm text-slate-500">{formatDateTime(flight.departAt)}</p>
        <p className="text-sm text-slate-600">Airline: {flight.airline ?? "-"}</p>
      </Card>
      {historyQuery.isLoading ? (
        <Spinner />
      ) : historyQuery.isError ? (
        <p className="text-sm text-red-500">Unable to load price history.</p>
      ) : history.length === 0 ? (
        <p className="text-sm text-slate-500">No price history available.</p>
      ) : (
        <PriceHistoryChart data={history} />
      )}
      {predictionQuery.isLoading ? (
        <Spinner />
      ) : predictionQuery.isError ? (
        <p className="text-sm text-red-500">Unable to load prediction.</p>
      ) : (
        <PredictionPanel
          prediction={predictionQuery.data}
          latestActual={latestActual}
        />
      )}
    </div>
  );
};
