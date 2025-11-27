using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Config;

public class RoleConfiguration: IEntityTypeConfiguration<IdentityRole>
{
    public void Configure(EntityTypeBuilder<IdentityRole> builder)
    {
        // Fixed GUIDs to keep the model deterministic
        const string adminRoleId = "f7e5e9d5-0b32-4f3d-9a0b-111111111111";
        const string customerRoleId = "a8c3bb3e-3c44-4b77-9b1a-222222222222";
        
        builder.HasData(
            new IdentityRole{Id = adminRoleId, Name = "Admin", NormalizedName = "ADMIN"},
            new IdentityRole{Id = customerRoleId, Name = "Customer", NormalizedName = "CUSTOMER"}
        );
    }
}