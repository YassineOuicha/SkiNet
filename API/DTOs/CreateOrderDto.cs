using System.ComponentModel.DataAnnotations;
using Core.Entities.OrderAggregate;

namespace API.DTOs;

public class CreateOrderDto
{
    [Required] public string CartId { get; set; } = "";

    [Required] public int DeliveryMethodId { get; set; }

    // TODO : create dtos to replace these two entities later on
    [Required] public ShippingAddress ShippingAddress { get; set; } = null!;
    [Required] public PaymentSummary PaymentSummary { get; set; } = null!;
    public decimal Discount { get; set; }
}