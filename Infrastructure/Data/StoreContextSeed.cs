using System.Reflection;
using System.Text.Json;
using Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data;

public class StoreContextSeed
{
   public static async Task SeedAsync(StoreContext context, UserManager<AppUser> userManager)
   {
      if (!userManager.Users.Any(x => x.UserName == "admin@test.com"))
      {
         var user = new AppUser
         {
            UserName = "admin@test.com",
            Email = "admin@test.com",
            FirstName = "User",
            LastName = "Admin",
         };
         
         // TO DO: password shouldn't be hardcoded in production
         await userManager.CreateAsync(user, "Pa$$w0rd");
         await userManager.AddToRoleAsync(user, "Admin");
      }
      var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
      
      if (!context.Products.Any())
      {
         var productsData = await File
            .ReadAllTextAsync(path + @"/Data/SeedData/products.json");  
         
         var products = JsonSerializer.Deserialize<List<Product>>(productsData);
         
         if (products == null) return;
         
         context.Products.AddRange(products);
         await context.SaveChangesAsync();
      }
      
      if (!context.DeliveryMethods.Any())
      {
         var deliveryData = await File
            .ReadAllTextAsync(path + @"/Data/SeedData/delivery.json");  
         
         var methods = JsonSerializer.Deserialize<List<DeliveryMethod>>(deliveryData);
         
         if (methods == null) return;
         
         context.DeliveryMethods.AddRange(methods);
         await context.SaveChangesAsync();
      }
   }
}