import { Link } from "react-router-dom";
import { Button } from "../shared/ui/Button";
import { Card } from "../shared/ui/Card";

export const HomePage = () => (
  <div className="space-y-6">
    <Card className="space-y-3">
      <h1 className="text-2xl font-semibold">Flight Price Prediction Platform</h1>
      <p className="text-slate-600">
        Explore upcoming flights, inspect historical fare trends, and receive ML
        recommendations on when to buy.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link to="/flights">
          <Button>Browse flights</Button>
        </Link>
        <Link to="/analytics">
          <Button className="bg-slate-900 hover:bg-slate-800">View analytics</Button>
        </Link>
      </div>
    </Card>
    <div className="grid gap-4 md:grid-cols-3">
      {[
        {
          title: "Search & discover",
          body: "Find routes and compare fares across carriers."
        },
        {
          title: "Predictive insights",
          body: "Understand projected prices and optimal booking windows."
        },
        {
          title: "Ticket tracking",
          body: "Manage purchased tickets and filter by flight or date."
        }
      ].map((item) => (
        <Card key={item.title}>
          <p className="text-base font-semibold">{item.title}</p>
          <p className="mt-2 text-sm text-slate-600">{item.body}</p>
        </Card>
      ))}
    </div>
  </div>
);
