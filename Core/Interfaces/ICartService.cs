using Core.Entities;

namespace Core.Interfaces;

// we don't use repository naming because doesn't interact with EF Core, but Redis
public interface ICartService
{
    Task<ShoppingCart?> GetCartAsync(string cartId);
    Task<ShoppingCart?> SetCartAsync(ShoppingCart cart);
    Task<bool> DeleteCartAsync(string cartId);
}