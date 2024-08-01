using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShoppingList.Shared.Models;

namespace ShoppingList.Api.Data.Configuration;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
  public void Configure(EntityTypeBuilder<Category> builder)
  {
    builder.HasKey(x => x.Id);
    builder.Property(e => e.Id).IsRequired();
    builder.Property(e => e.Name).IsRequired();
  }
}
