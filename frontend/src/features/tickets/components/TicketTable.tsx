import type { Ticket } from "../../../shared/api/types";
import { Card } from "../../../shared/ui/Card";
import { formatCurrency, formatDateTime } from "../../../shared/utils/format";

export const TicketTable = ({ tickets }: { tickets: Ticket[] }) => (
  <Card>
    <div className="mb-4">
      <p className="text-base font-semibold">Tickets</p>
      <p className="text-sm text-slate-500">Managed bookings and purchases</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-slate-400">
          <tr>
            <th className="py-2">Ticket ID</th>
            <th className="py-2">Flight ID</th>
            <th className="py-2">Price Paid</th>
            <th className="py-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="border-t border-slate-100">
              <td className="py-2 font-medium text-slate-800">{ticket.id}</td>
              <td className="py-2 text-slate-600">{ticket.flightId}</td>
              <td className="py-2 text-slate-600">
                {formatCurrency(ticket.pricePaid)}
              </td>
              <td className="py-2 text-slate-600">
                {formatDateTime(ticket.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);
