namespace ShoppingList.Application.Abstractions;

public interface IJsService
{
    Task LogToConsole(string message);
    Task LogToConsoleTable(object obj);
}
