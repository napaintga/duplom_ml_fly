import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { PricePoint } from "../../../shared/api/types";
import { formatCurrency, formatDateTime } from "../../../shared/utils/format";
import { Card } from "../../../shared/ui/Card";

const formatAxis = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

type PriceHistoryChartProps = {
  data: PricePoint[];
};

export const PriceHistoryChart = ({ data }: PriceHistoryChartProps) => (
  <Card className="h-80">
    <div className="mb-4">
      <p className="text-base font-semibold">Price history</p>
      <p className="text-sm text-slate-500">Recent fares for this route</p>
    </div>
    <ResponsiveContainer width="100%" height="80%">
      <LineChart data={data}>
        <XAxis dataKey="ts" tickFormatter={formatAxis} />
        <YAxis tickFormatter={(value) => formatCurrency(Number(value))} />
        <Tooltip
          labelFormatter={(label) => formatDateTime(label)}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);
