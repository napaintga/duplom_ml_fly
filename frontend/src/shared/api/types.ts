export type Flight = {
  id: string;
  origin: string;
  destination: string;
  departAt: string;
  airline?: string;
};

export type PricePoint = { ts: string; price: number };

export type Prediction = {
  flightId: string;
  predictedPrice: number;
  lower?: number;
  upper?: number;
  modelName?: string;
  createdAt: string;
};

export type Ticket = {
  id: string;
  flightId: string;
  userId?: string;
  pricePaid?: number;
  createdAt: string;
};

export type ActualVsPredictedPoint = {
  ts: string;
  actual: number;
  predicted: number;
};

export type Metrics = {
  mae?: number;
  rmse?: number;
  mape?: number;
  modelName?: string;
  updatedAt?: string;
};
