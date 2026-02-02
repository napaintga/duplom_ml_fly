import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout";
import { AnalyticsPage } from "../../pages/AnalyticsPage";
import { FlightDetailsPage } from "../../pages/FlightDetailsPage";
import { FlightsPage } from "../../pages/FlightsPage";
import { HomePage } from "../../pages/HomePage";
import { NotFoundPage } from "../../pages/NotFoundPage";
import { TicketsPage } from "../../pages/TicketsPage";

export const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/flights" element={<FlightsPage />} />
        <Route path="/flights/:id" element={<FlightDetailsPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
