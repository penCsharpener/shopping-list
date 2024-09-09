using Microsoft.JSInterop;
using ShoppingList.Application.Abstractions;

#pragma warning disable IDE0130 // Namespace does not match folder structure
namespace ShoppingList.Client.Services;
#pragma warning restore IDE0130 // Namespace does not match folder structure

public class JsService : IJsService
{
    private readonly IJSRuntime _jsRuntime;

    public JsService(IJSRuntime jSRuntime)
    {
        _jsRuntime = jSRuntime;
    }

    public async Task LogToConsole(string message)
    {
        await _jsRuntime.InvokeVoidAsync("shoppingList.logToConsole", message);
    }

    public async Task LogToConsoleTable(object obj)
    {
        await _jsRuntime.InvokeVoidAsync("shoppingList.logToConsoleTable", obj);
    }
}
