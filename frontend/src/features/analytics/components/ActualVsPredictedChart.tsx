import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { ActualVsPredictedPoint } from "../../../shared/api/types";
import { Card } from "../../../shared/ui/Card";
import { formatCurrency, formatDateTime } from "../../../shared/utils/format";

const formatAxis = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

type ActualVsPredictedChartProps = {
  data: ActualVsPredictedPoint[];
};

export const ActualVsPredictedChart = ({
  data
}: ActualVsPredictedChartProps) => (
  <Card className="h-80">
    <div className="mb-4">
      <p className="text-base font-semibold">Actual vs predicted</p>
      <p className="text-sm text-slate-500">Model performance over time</p>
    </div>
    <ResponsiveContainer width="100%" height="80%">
      <LineChart data={data}>
        <XAxis dataKey="ts" tickFormatter={formatAxis} />
        <YAxis tickFormatter={(value) => formatCurrency(Number(value))} />
        <Tooltip
          labelFormatter={(label) => formatDateTime(label)}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Line type="monotone" dataKey="actual" stroke="#0f172a" strokeWidth={2} />
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="#2563eb"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);
