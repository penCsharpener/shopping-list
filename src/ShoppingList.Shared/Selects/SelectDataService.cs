using System.Net.Http.Json;
using ShoppingList.Application.Abstractions;
using ShoppingList.Application.Models.Selects;

namespace ShoppingList.Client.Components.Selects;

public class SelectDataService : ISelectDataService
{
    private readonly HttpClient _httpClient;

    public SelectDataService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<SelectData> GetData(CancellationToken token = default)
    {
        var result = await _httpClient.GetFromJsonAsync<SelectData>("api/data/select");

        return result;
    }
}

