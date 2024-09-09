﻿namespace ShoppingList.Application.Models;

public class Category
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int SortOrder { get; set; }
}
