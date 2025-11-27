using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixRolesAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1cc93296-0814-432a-9892-71958336f592");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9640990f-dd93-4ff1-bc0f-791d0df1ca94");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "a8c3bb3e-3c44-4b77-9b1a-222222222222", null, "Customer", "CUSTOMER" },
                    { "f7e5e9d5-0b32-4f3d-9a0b-111111111111", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a8c3bb3e-3c44-4b77-9b1a-222222222222");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f7e5e9d5-0b32-4f3d-9a0b-111111111111");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1cc93296-0814-432a-9892-71958336f592", null, "Admin", "ADMIN" },
                    { "9640990f-dd93-4ff1-bc0f-791d0df1ca94", null, "Customer", "CUSTOMER" }
                });
        }
    }
}
