namespace ShoppingList.Application.Models;

public sealed class Subcategory
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int SortOrder { get; set; }
    public int CategoryId { get; set; }

    public Category Category { get; set; } = default!;
}
