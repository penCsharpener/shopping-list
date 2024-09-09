using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using MudBlazor.Services;
using ShoppingList.Application.Abstractions;
using ShoppingList.Client.Components.Selects;
using ShoppingList.Client.Services;

namespace ShoppingList.Client;
public class Program
{
  public static async Task Main(string[] args)
  {
    var builder = WebAssemblyHostBuilder.CreateDefault(args);
    builder.RootComponents.Add<App>("#app");
    builder.RootComponents.Add<HeadOutlet>("head::after");

    builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
    builder.Services.AddScoped<ISelectDataService, SelectDataService>();
    builder.Services.AddScoped<IJsService, JsService>();
    builder.Services.AddMudServices();
    //builder.Services.AddOidcAuthentication(options =>
    //    {
    //        // Configure your authentication provider options here.
    //        // For more information, see https://aka.ms/blazor-standalone-auth
    //        builder.Configuration.Bind("Local", options.ProviderOptions);
    //    });

    await builder.Build().RunAsync();
  }
}
