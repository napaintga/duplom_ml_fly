import type { Metrics } from "../../../shared/api/types";
import { Card } from "../../../shared/ui/Card";
import { formatDateTime } from "../../../shared/utils/format";

export const MetricsCards = ({ metrics }: { metrics?: Metrics }) => (
  <div className="grid gap-4 md:grid-cols-3">
    <Card>
      <p className="text-sm text-slate-500">MAE</p>
      <p className="text-2xl font-semibold text-slate-900">
        {metrics?.mae ?? "-"}
      </p>
    </Card>
    <Card>
      <p className="text-sm text-slate-500">RMSE</p>
      <p className="text-2xl font-semibold text-slate-900">
        {metrics?.rmse ?? "-"}
      </p>
    </Card>
    <Card>
      <p className="text-sm text-slate-500">MAPE</p>
      <p className="text-2xl font-semibold text-slate-900">
        {metrics?.mape ?? "-"}
      </p>
    </Card>
    <Card className="md:col-span-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Model</p>
          <p className="text-base font-semibold text-slate-900">
            {metrics?.modelName ?? "-"}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Updated</p>
          <p className="text-base font-semibold text-slate-900">
            {formatDateTime(metrics?.updatedAt)}
          </p>
        </div>
      </div>
    </Card>
  </div>
);
