import { useQuery } from "@tanstack/react-query";
import { fetchActualVsPredicted, fetchMetrics } from "./api";

export const useActualVsPredicted = () =>
  useQuery({
    queryKey: ["analytics", "actual-vs-predicted"],
    queryFn: fetchActualVsPredicted
  });

export const useMetrics = () =>
  useQuery({
    queryKey: ["analytics", "metrics"],
    queryFn: fetchMetrics
  });
