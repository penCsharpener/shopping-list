namespace ShoppingList.Application.Models;

public class GeneralItem
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required IList<Item> Items { get; set; }
}
