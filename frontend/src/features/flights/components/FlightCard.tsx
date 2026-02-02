import { Link } from "react-router-dom";
import type { Flight } from "../../../shared/api/types";
import { Card } from "../../../shared/ui/Card";
import { formatDateTime } from "../../../shared/utils/format";

export const FlightCard = ({ flight }: { flight: Flight }) => (
  <Card className="flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-lg font-semibold">
          {flight.origin} → {flight.destination}
        </p>
        <p className="text-sm text-slate-500">{formatDateTime(flight.departAt)}</p>
      </div>
      <Link
        to={`/flights/${flight.id}`}
        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        View details
      </Link>
    </div>
    <div className="text-sm text-slate-600">
      Airline: <span className="font-medium text-slate-800">{flight.airline ?? "-"}</span>
    </div>
  </Card>
);
