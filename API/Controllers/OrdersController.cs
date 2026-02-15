using API.DTOs;
using API.Extensions;
using API.RequestHelpers;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class OrdersController(ICartService cartService, IUnitOfWork unit) : BaseApiController
{
    [InvalidateCache(("api/products|"))]
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
    {
        var email = User.GetEmail();
        var cart = await cartService.GetCartAsync(orderDto.CartId);
        if (cart == null)
        {
            return BadRequest("Cart not found");
        }

        if (cart.PaymentIntentId == null)
        {
            return BadRequest("No payment intent for this order");
        }

        var items = new List<OrderItem>();
        foreach (var item in cart.Items)
        {
            var productItem = await unit.Repository<Product>().GetByIdAsync(item.ProductId);
            if (productItem == null)
            {
                return BadRequest($"Product with ID {item.ProductId} not found");
            }
            
            if (productItem.QuantityInStock < item.Quantity)
            {
                return BadRequest($"Not enough stock for {productItem.Name}. Available stock: {productItem.QuantityInStock} items.");
            }
            
            // Decrease the stock quantity of the product
            productItem.QuantityInStock -= item.Quantity;
            
            var itemOrdered = new ProductItemOrdered
            {
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                PictureUrl = item.PictureUrl
            };

            var orderItem = new OrderItem
            {
                ItemOrdered = itemOrdered,
                Price = productItem.Price,
                Quantity = item.Quantity,
            };

            items.Add(orderItem);
            
            // Update the product stock in the database
            unit.Repository<Product>().Update(productItem);
        }

        var deliveryMethod = await unit.Repository<DeliveryMethod>().GetByIdAsync(orderDto.DeliveryMethodId);

        if (deliveryMethod == null)
        {
            return BadRequest("No delivery metho selected, please select one!");
        }

        // Create the new order object
        var order = new Order
        {
            OrderItems = items,
            DeliveryMethod = deliveryMethod,
            ShippingAddress = orderDto.ShippingAddress,
            Subtotal = items.Sum(x => x.Price * x.Quantity),
            Discount = orderDto.Discount,
            PaymentIntentId = cart.PaymentIntentId,
            BuyerEmail = email,
            PaymentSummary = orderDto.PaymentSummary,
        };
        
        // Check if there is an existing order with the same payment intent ID
        var spec = new OrderSpecification(cart.PaymentIntentId, true);
        var existingOrder = await unit.Repository<Order>().GetEntityWithSpec(spec);

        if (existingOrder is not null)
        {
            // Merge fields to preserve the existing order while updating necessary details
            existingOrder.OrderItems = order.OrderItems;
            existingOrder.DeliveryMethod = order.DeliveryMethod;
            existingOrder.ShippingAddress = order.ShippingAddress;
            existingOrder.Subtotal = order.Subtotal;
            existingOrder.Discount = order.Discount;
            existingOrder.PaymentSummary = order.PaymentSummary;
            existingOrder.BuyerEmail = order.BuyerEmail;
            
            // Update the existing order in the database
            unit.Repository<Order>().Update(existingOrder);
            order = existingOrder; // Set the return value to the updated order
        }
        else
        {
            // Add the new order to the database if no existing order is found
            unit.Repository<Order>().Add(order);
        }

        if (await unit.Complete())
        {
            return order;
        }

        return BadRequest("Problem creating order");
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetOrdersForUser()
    {
        var spec = new OrderSpecification(User.GetEmail());
        var orders = await unit.Repository<Order>().ListAsync(spec);

        var ordersToReturn = orders.Select(o => o.ToDto());
        return Ok(ordersToReturn);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        var spec = new OrderSpecification(User.GetEmail(), id);
        var order = await unit.Repository<Order>().GetEntityWithSpec(spec);

        if (order == null)
        {
            return NotFound();
        }

        return order.ToDto();
    }
}