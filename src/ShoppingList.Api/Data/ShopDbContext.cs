using Microsoft.EntityFrameworkCore;
using ShoppingList.Shared.Models;

namespace ShoppingList.Api.Data;

public class ShopDbContext : DbContext
{
    public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder optionsBuilder)
    {
        optionsBuilder.ApplyConfigurationsFromAssembly(typeof(ShopDbContext).Assembly);

        base.OnModelCreating(optionsBuilder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
#if DEBUG
        optionsBuilder.EnableSensitiveDataLogging();
        optionsBuilder.EnableDetailedErrors();
#endif

        base.OnConfiguring(optionsBuilder);
    }

    public DbSet<Shop> Shops { get; set; }
    public DbSet<Item> Items { get; set; }
    public DbSet<GeneralItem> GeneralItems { get; set; }
    public DbSet<Subcategory> Subcategories { get; set; }
    public DbSet<Category> Categories { get; set; }
}
