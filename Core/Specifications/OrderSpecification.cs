using Core.Entities.OrderAggregate;

namespace Core.Specifications;

public class OrderSpecification: BaseSpecification<Order>
{
    // To retrieve a list of orders by the user whose email is provided
    public OrderSpecification(string email) : base(x => x.BuyerEmail == email)
    {
        AddInclude(x => x.OrderItems);
        AddInclude(x => x.DeliveryMethod);
        AddOrderByDescending(x => x.OrderDate);
    }

    // To retrieve a specific order (id) by the user whose email is provided
    public OrderSpecification(string email, int id) : base(x => x.BuyerEmail == email && x.Id == id)
    {
        AddInclude("OrderItems");
        AddInclude("DeliveryMethod");
    }
}