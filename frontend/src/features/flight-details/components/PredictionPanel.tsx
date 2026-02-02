import type { Prediction } from "../../../shared/api/types";
import { Card } from "../../../shared/ui/Card";
import { formatCurrency, formatDateTime } from "../../../shared/utils/format";

const getRecommendation = (prediction?: Prediction, latestActual?: number) => {
  if (!prediction || latestActual === undefined) return "N/A";
  return prediction.predictedPrice > latestActual ? "BUY" : "WAIT";
};

type PredictionPanelProps = {
  prediction?: Prediction;
  latestActual?: number;
};

export const PredictionPanel = ({
  prediction,
  latestActual
}: PredictionPanelProps) => {
  const recommendation = getRecommendation(prediction, latestActual);
  return (
    <Card className="flex flex-col gap-3">
      <div>
        <p className="text-base font-semibold">Prediction</p>
        <p className="text-sm text-slate-500">Model forecast & recommendation</p>
      </div>
      <div className="grid gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Predicted price</span>
          <span className="font-semibold text-slate-900">
            {formatCurrency(prediction?.predictedPrice)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Interval</span>
          <span className="font-semibold text-slate-900">
            {prediction?.lower !== undefined && prediction?.upper !== undefined
              ? `${formatCurrency(prediction.lower)} - ${formatCurrency(
                  prediction.upper
                )}`
              : "-"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Model</span>
          <span className="font-semibold text-slate-900">
            {prediction?.modelName ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Generated</span>
          <span className="font-semibold text-slate-900">
            {formatDateTime(prediction?.createdAt)}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-blue-50 px-3 py-2 text-blue-700">
          <span className="text-sm font-medium">Recommendation</span>
          <span className="text-sm font-semibold">{recommendation}</span>
        </div>
      </div>
    </Card>
  );
};
