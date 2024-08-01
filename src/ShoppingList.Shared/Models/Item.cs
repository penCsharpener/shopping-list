namespace ShoppingList.Shared.Models;

public class Item
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int ShopId { get; set; }
    public int CategoryId { get; set; }
    public int SubcategoryId { get; set; }
    public int GeneralItemId { get; set; }

    public string? ImageUrl { get; set; }
    public decimal? Price { get; set; }
    public int Amount { get; set; }

    public required GeneralItem GeneralItem { get; set; }
    public required Shop Shop { get; set; }
    public required Category Category { get; set; }
    public required Subcategory Subcategory { get; set; }
}
