using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using ShoppingList.Api.Data;
using ShoppingList.Application.Models.Selects;

namespace ShoppingList.Api.Features.Selects;

public class GetSelectData : EndpointWithoutRequest<SelectData>
{
  private readonly ShopDbContext _context;

  public GetSelectData(ShopDbContext context)
  {
    _context = context;
  }

  public override void Configure()
  {
    Get("api/data/select");
    AllowAnonymous();
  }

  public override async Task HandleAsync(CancellationToken ct)
  {
    var shops = await _context.Shops.ToArrayAsync(ct);
    var categories = await _context.Categories.ToArrayAsync(ct);
    var subcategories = await _context.Subcategories.ToArrayAsync(ct);

    await SendAsync(new SelectData()
    {
      Shops = shops,
      Categories = categories,
      Subcategories = subcategories
    }, 200, ct);
  }
}