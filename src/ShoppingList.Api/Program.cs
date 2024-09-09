
using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using Serilog;
using ShoppingList.Api.Data;
using ShoppingList.Api.Extensions;
using ShoppingList.Application.Models.Settings;

namespace ShoppingList.Api;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddAuthorization();
        builder.Services.AddControllersWithViews();
        builder.Services.AddRazorPages();
        var connectionString = builder.Configuration.GetDefaultConnectionString();
        var settings = builder.Configuration.GetSection(nameof(Appsettings)).Get<Appsettings>()!;

        builder.Services.AddSerilog(conf => conf.ReadFrom.Configuration(builder.Configuration));

        builder.Services.AddDbContext<ShopDbContext>(options => options.UseSqlite(connectionString, o => o.MigrationsAssembly(typeof(Program).Assembly.ToString())));
        builder.Services.AddFastEndpoints(options =>
        {
            options.Assemblies = new[] { typeof(Program).Assembly };
        });

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        app.UseFastEndpoints();
        await app.SeedDatabaseAsync(settings);

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseWebAssemblyDebugging();
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        else
        {
            app.UseExceptionHandler("/Error");

            app.UseHsts();
        }

        app.UseHttpsRedirection();

        app.UseBlazorFrameworkFiles();
        app.UseStaticFiles();

        app.UseAuthorization();

        app.MapRazorPages();
        app.MapControllers();
        app.MapFallbackToFile("index.html");

        var summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        app.MapGet("/api/weatherforecast", (HttpContext httpContext) =>
        {
            var forecast = Enumerable.Range(1, 20).Select(index =>
                new WeatherForecast
                {
                    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    TemperatureC = Random.Shared.Next(-20, 55),
                    Summary = summaries[Random.Shared.Next(summaries.Length)]
                })
                .ToArray();
            return forecast;
        })
        .WithName("GetWeatherForecast")
        .WithOpenApi();

        await app.RunAsync();
    }
}
