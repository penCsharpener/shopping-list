using MudBlazor.Services;
using ShoppingList.Application.Abstractions;
using ShoppingList.Client.Components.Selects;
using ShoppingList.Client.Services;
using ShoppingList.DebugServer.Components;

namespace ShoppingList.DebugServer;
public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddRazorComponents().AddInteractiveServerComponents();

        builder.Services.AddScoped<ISelectDataService, SelectDataService>();
        builder.Services.AddScoped<IJsService, JsService>();
        builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("https://localhost:7237") });
        builder.Services.AddMudServices();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        app.UseHttpsRedirection();

        app.UseStaticFiles();
        app.UseAntiforgery();

        app.MapRazorComponents<App>().AddInteractiveServerRenderMode();

        app.Run();
    }
}
