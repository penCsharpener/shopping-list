namespace ShoppingList.Application.Models;

public class Shop
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string IconName { get; set; }

    public IList<Item>? Items { get; set; }
}