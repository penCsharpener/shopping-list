﻿using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ShoppingList.Api.Data;
using ShoppingList.Shared.Models;
using ShoppingList.Shared.Models.Settings;

namespace ShoppingList.Api.Extensions;

public static class BuilderExtensions
{
  public static string GetDefaultConnectionString(this IConfigurationManager configuration)
  {
    return configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
  }
}

public static class DbSeedingExtensions
{
  private static readonly Dictionary<string, Func<string, ShopDbContext, Task>> seedFiles = new()
    {
        { "shops", async (location, context) => await SaveToDb<Shop>(location, "shops.json", a => context.Shops.AddRange(a)) },
        { "categories", async (location, context) => await SaveToDb<Category>(location, "categories.json", a => context.Categories.AddRange(a)) },
        { "subcategories", async ( location, context) => await SaveToDb<Subcategory>(location, "subcategories.json", a => context.Subcategories.AddRange(a)) },
    };

  public static async Task SeedDatabaseAsync(this WebApplication app, Appsettings settings)
  {
    try
    {
      var scopeFactory = app.Services.GetRequiredService<IServiceScopeFactory>();
      using var scope = scopeFactory.CreateScope();
      using var context = scope.ServiceProvider.GetRequiredService<ShopDbContext>();

      context.Database.EnsureCreated();

      foreach (var kvp in seedFiles)
      {
        await kvp.Value(settings.SeedFilesLocation, context);
      }

      await context.SaveChangesAsync();
    }
    catch (DbUpdateException)
    {

    }
  }

  private static async Task SaveToDb<T>(string seedFileLocation, string fileName, Action<List<T>> addAction) where T : class
  {
    var filePath = Path.Combine(seedFileLocation, fileName);

    if (File.Exists(filePath))
    {
      var fileContent = await File.ReadAllTextAsync(filePath);
      var objects = (List<T>)JsonSerializer.Deserialize(fileContent, typeof(List<T>))!;
      addAction.Invoke(objects);
    }
  }
}
