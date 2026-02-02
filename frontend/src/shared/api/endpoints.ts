export const endpoints = {
  flights: "/api/flights",
  flightById: (id: string) => `/api/flights/${id}`,
  flightHistory: (id: string) => `/api/flights/${id}/price-history`,
  predict: (id: string) => `/api/predictions/flight/${id}`,
  tickets: "/api/tickets",
  analyticsActualVsPred: "/api/analytics/actual-vs-predicted",
  analyticsMetrics: "/api/analytics/metrics"
};
