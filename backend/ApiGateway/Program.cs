using System.Data;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IDbConnection>(_ =>
{
    var connectionString =
        builder.Configuration["POSTGRES_CONNECTION"] ??
        builder.Configuration.GetConnectionString("Postgres");

    return new NpgsqlConnection(connectionString);
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/api/flights", async (
    [FromServices] IDbConnection db,
    string? q,
    string? date,
    string? origin,
    string? destination) =>
{
    const string sql = """
        SELECT id, origin, destination, depart_at AS departat, airline
        FROM flights
        WHERE (@q IS NULL OR origin ILIKE '%' || @q || '%' OR destination ILIKE '%' || @q || '%' OR airline ILIKE '%' || @q || '%')
          AND (@origin IS NULL OR origin = @origin)
          AND (@destination IS NULL OR destination = @destination)
          AND (@date IS NULL OR depart_at::date = @date::date)
        ORDER BY depart_at DESC
        LIMIT 200;
        """;

    var results = await db.QueryAsync<FlightDto>(sql, new
    {
        q,
        origin,
        destination,
        date
    });

    return Results.Ok(results);
});

app.MapGet("/api/flights/{id}", async ([FromServices] IDbConnection db, Guid id) =>
{
    const string sql = """
        SELECT id, origin, destination, depart_at AS departat, airline
        FROM flights
        WHERE id = @id;
        """;

    var flight = await db.QuerySingleOrDefaultAsync<FlightDto>(sql, new { id });

    return flight is null
        ? Results.NotFound()
        : Results.Ok(flight);
});

app.MapGet("/api/flights/{id}/price-history", async (
    [FromServices] IDbConnection db,
    Guid id) =>
{
    const string sql = """
        SELECT ts, price_amount AS price
        FROM flight_price_history
        WHERE flight_offer_id = @id
        ORDER BY ts ASC;
        """;

    var points = await db.QueryAsync<PricePointDto>(sql, new { id });

    return Results.Ok(points);
});

app.MapGet("/api/predictions/flight/{id}", async (
    [FromServices] IDbConnection db,
    Guid id) =>
{
    const string sql = """
        SELECT flight_id AS flightid,
               predicted_price AS predictedprice,
               lower_bound AS lower,
               upper_bound AS upper,
               model_name AS modelname,
               created_at AS createdat
        FROM flight_predictions
        WHERE flight_id = @id
        ORDER BY created_at DESC
        LIMIT 1;
        """;

    var prediction = await db.QuerySingleOrDefaultAsync<PredictionDto>(sql, new { id });

    return prediction is null
        ? Results.NotFound()
        : Results.Ok(prediction);
});

app.MapGet("/api/tickets", async (
    [FromServices] IDbConnection db,
    string? flightId,
    string? from,
    string? to) =>
{
    const string sql = """
        SELECT id, flight_id AS flightid, user_id AS userid, price_paid AS pricepaid, created_at AS createdat
        FROM tickets
        WHERE (@flightId IS NULL OR flight_id::text = @flightId)
          AND (@from IS NULL OR created_at::date >= @from::date)
          AND (@to IS NULL OR created_at::date <= @to::date)
        ORDER BY created_at DESC
        LIMIT 200;
        """;

    var tickets = await db.QueryAsync<TicketDto>(sql, new { flightId, from, to });

    return Results.Ok(tickets);
});

app.MapGet("/api/analytics/actual-vs-predicted", async ([FromServices] IDbConnection db) =>
{
    const string sql = """
        SELECT ts, actual, predicted
        FROM analytics_actual_vs_predicted
        ORDER BY ts ASC;
        """;

    var data = await db.QueryAsync<ActualVsPredictedPointDto>(sql);

    return Results.Ok(data);
});

app.MapGet("/api/analytics/metrics", async ([FromServices] IDbConnection db) =>
{
    const string sql = """
        SELECT mae, rmse, mape, model_name AS modelname, updated_at AS updatedat
        FROM analytics_metrics
        ORDER BY updated_at DESC
        LIMIT 1;
        """;

    var metrics = await db.QuerySingleOrDefaultAsync<MetricsDto>(sql);

    return metrics is null
        ? Results.NotFound()
        : Results.Ok(metrics);
});

app.Run();

record FlightDto(Guid Id, string Origin, string Destination, DateTime DepartAt, string? Airline);
record PricePointDto(DateTime Ts, decimal Price);
record PredictionDto(Guid FlightId, decimal PredictedPrice, decimal? Lower, decimal? Upper, string? ModelName, DateTime CreatedAt);
record TicketDto(Guid Id, Guid FlightId, string? UserId, decimal? PricePaid, DateTime CreatedAt);
record ActualVsPredictedPointDto(DateTime Ts, decimal Actual, decimal Predicted);
record MetricsDto(decimal? Mae, decimal? Rmse, decimal? Mape, string? ModelName, DateTime? UpdatedAt);
