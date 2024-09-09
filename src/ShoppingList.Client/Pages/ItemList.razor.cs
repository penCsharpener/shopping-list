using Microsoft.AspNetCore.Components;
using ShoppingList.Application.Abstractions;
using ShoppingList.Application.Models;
using ShoppingList.Application.Models.Selects;

namespace ShoppingList.Client.Pages;
public partial class ItemList
{
    private SelectData? _selectData;
    private Subcategory? _selectedSubCategory;

    [Inject] public required ISelectDataService DataService { get; set; }
    [Inject] public required IJsService JavaScriptService { get; set; }

    protected override async Task OnInitializedAsync()
    {
        _selectData = await DataService.GetData();
    }

    private async Task OnSelectHandler(Subcategory subcategory)
    {
        _selectedSubCategory = subcategory;
        Console.WriteLine(_selectedSubCategory.Name);
        await JavaScriptService.LogToConsoleTable(_selectedSubCategory);
        StateHasChanged();
    }

    private async Task DebugHere()
    {
        Console.WriteLine(_selectedSubCategory?.Name);
        await JavaScriptService.LogToConsoleTable(_selectedSubCategory);
        StateHasChanged();
    }
}