using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services;

public class CouponService : ICouponService
{
    public CouponService(IConfiguration config)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];
    }

    public async Task<AppCoupon?> GetCouponFromPromoCode(string code)
    {
        var promotionService = new PromotionCodeService();
        var promoOptions = new PromotionCodeListOptions
        {
            Code = code,
            Limit = 1 // We only need a single promotion code
        };

        var promoCodes = await promotionService.ListAsync(promoOptions);
        var promoCode = promoCodes.Data.FirstOrDefault(); // Just the first one

        if (promoCode == null)
        {
            return null;
        }

        if (string.IsNullOrWhiteSpace(promoCode.Id))
        {
            return null;
        }

        var stripeCouponService = new Stripe.CouponService();
        var coupon = await stripeCouponService.GetAsync(promoCode.Id);

        if (coupon == null)
        {
            return null;
        }

        return new AppCoupon
        {
            Name = coupon.Name,
            AmountOff = coupon.AmountOff,
            PercentOff = coupon.PercentOff,
            PromotionCode = promoCode.Code,
            CouponId = coupon.Id
        };
    }
}