using Microsoft.AspNetCore.Components;
using ShoppingList.Application.Models;

namespace ShoppingList.Components.Selects;
public partial class SubcategorySelect
{
    [Parameter]
    public Subcategory[] Subcategories { get; set; } = new Subcategory[] { };

    [Parameter]
    public EventCallback<Subcategory?> OnSelect { get; set; }

    [Parameter]
    public Subcategory? Value { get; set; }

    private async Task OnSelectionChangedAsync(ChangeEventArgs args)
    {
        await OnSelect.InvokeAsync(args?.Value as Subcategory);
    }
}