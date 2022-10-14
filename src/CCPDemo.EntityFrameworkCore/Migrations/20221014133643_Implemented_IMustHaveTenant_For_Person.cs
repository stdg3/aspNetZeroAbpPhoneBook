using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CCPDemo.Migrations
{
    public partial class Implemented_IMustHaveTenant_For_Person : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "PbPersons",
                type: "int",
                nullable: false,
                defaultValue: 1);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "PbPersons");
        }
    }
}
