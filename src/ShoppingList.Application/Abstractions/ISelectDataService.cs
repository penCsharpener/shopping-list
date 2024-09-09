using ShoppingList.Application.Models.Selects;

namespace ShoppingList.Application.Abstractions;

public interface ISelectDataService
{
    Task<SelectData> GetData(CancellationToken token = default);
}

