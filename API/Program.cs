using API.Middleware;
using API.SignalR;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddCors();
builder.Services.AddSingleton<IConnectionMultiplexer>(config => 
    {
       var connString = builder.Configuration.GetConnectionString("Redis")
                        ?? throw new Exception("Redis connection string is not configured.");
       var configuration = ConfigurationOptions.Parse(connString, true); 
       return ConnectionMultiplexer.Connect(configuration);
    });
builder.Services.AddSingleton<ICartService, CartService>();
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>().AddEntityFrameworkStores<StoreContext>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddSignalR();

var app = builder.Build();

// configure the http request pipeline
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials()
    .WithOrigins("http://localhost:4200","https://localhost:4200"));

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();    

app.MapControllers();
app.MapGroup("api").MapIdentityApi<AppUser>();  // api/login
app.MapHub<NotificationHub>("/hub/notifications");

// angular should handle his routes / components & not by dotnet side ! so we use :
app.MapFallbackToController("Index", "Fallback");

try
{
    // so we can dispose the services outside the scope of injection...
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<StoreContext>();
    // applies any pending migrations for the context to the database. Will create the database if it does not already exist.
    await context.Database.MigrateAsync();
    
    // Seeding data
    await StoreContextSeed.SeedAsync(context);
}
catch (Exception e)
{
    Console.WriteLine(e);
    throw;
}

app.Run();
