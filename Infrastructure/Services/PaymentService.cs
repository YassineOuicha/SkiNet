using Microsoft.Extensions.Configuration;
using Core.Entities;
using Core.Interfaces;
using Stripe;
using Product = Core.Entities.Product;

namespace Infrastructure.Services;

public class PaymentService: IPaymentService
{
    private readonly ICartService  _cartService;
    private readonly IUnitOfWork _unit;

    public PaymentService(
        IConfiguration config,
        ICartService cartService,
        IUnitOfWork unit)
    {
        this._cartService = cartService;
        this._unit = unit;
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];
    }
    
    public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
    {
        var cart = await _cartService.GetCartAsync(cartId);
        if (cart == null)
        {
            return null;
        }

        var shippingPrice = 0m;

        if (cart.DeliveryMethodId.HasValue)
        {
            var deliveryMethod = await _unit.Repository<DeliveryMethod>().GetByIdAsync((int)cart.DeliveryMethodId);
            if (deliveryMethod == null)
            {
                return null;
            }

            shippingPrice = deliveryMethod.Price;
        }

        foreach (var item in cart.Items)
        {
            var productItem = await _unit.Repository<Product>().GetByIdAsync(item.ProductId);
            if (productItem == null)
            {
                return null;
            }

            if (item.Price != productItem.Price)
            {
                item.Price = productItem.Price;
            }
        }

        var service = new PaymentIntentService();
        PaymentIntent? intent = null;

        if (string.IsNullOrEmpty(cart.PaymentIntId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)cart.Items.Sum(x => x.Quantity * (x.Price * 100) + (long)shippingPrice * 100),
                Currency = "usd",
                PaymentMethodTypes = ["card"]
            };
            intent = await service.CreateAsync(options);
            cart.PaymentIntId = intent.Id;
            cart.ClientSecret = intent.ClientSecret;
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = (long)cart.Items.Sum(x => x.Quantity * (x.Price * 100) + (long)shippingPrice * 100)
            };
            intent = await service.UpdateAsync(cart.PaymentIntId, options);
        }

        await _cartService.SetCartAsync(cart);
        return cart;
    }

    public async Task<string> RefundPayment(string paymentIntentId)
    {
        var refundOptions = new RefundCreateOptions
        {
            PaymentIntent = paymentIntentId,
        };
        var refundService = new RefundService();
        var result = await refundService.CreateAsync(refundOptions);
        return result.Status;
    }
}