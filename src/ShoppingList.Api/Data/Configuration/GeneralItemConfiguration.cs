﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShoppingList.Application.Models;

namespace ShoppingList.Api.Data.Configuration;

public class GeneralItemConfiguration : IEntityTypeConfiguration<GeneralItem>
{
    public void Configure(EntityTypeBuilder<GeneralItem> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(e => e.Id).IsRequired();
        builder.Property(e => e.Name).IsRequired();
    }
}
