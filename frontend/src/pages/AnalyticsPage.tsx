import { ActualVsPredictedChart } from "../features/analytics/components/ActualVsPredictedChart";
import { MetricsCards } from "../features/analytics/components/MetricsCards";
import {
  useActualVsPredicted,
  useMetrics
} from "../features/analytics/hooks";
import { Spinner } from "../shared/ui/Spinner";

export const AnalyticsPage = () => {
  const actualVsPredictedQuery = useActualVsPredicted();
  const metricsQuery = useMetrics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-slate-500">
          Monitor model performance and prediction accuracy.
        </p>
      </div>
      {metricsQuery.isLoading ? (
        <Spinner />
      ) : metricsQuery.isError ? (
        <p className="text-sm text-red-500">Unable to load metrics.</p>
      ) : (
        <MetricsCards metrics={metricsQuery.data} />
      )}
      {actualVsPredictedQuery.isLoading ? (
        <Spinner />
      ) : actualVsPredictedQuery.isError ? (
        <p className="text-sm text-red-500">Unable to load chart data.</p>
      ) : (actualVsPredictedQuery.data?.length ?? 0) === 0 ? (
        <p className="text-sm text-slate-500">No analytics data found.</p>
      ) : (
        <ActualVsPredictedChart data={actualVsPredictedQuery.data ?? []} />
      )}
    </div>
  );
};
