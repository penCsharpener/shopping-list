using ShoppingList.Application.Models;

namespace ShoppingList.Application.Models.Selects;

public class SelectData
{
    public required Shop[] Shops { get; set; }
    public required Category[] Categories { get; set; }
    public required Subcategory[] Subcategories { get; set; }
}