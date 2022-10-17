using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CCPDemo.Migrations
{
    public partial class phoneTypeConstraint : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "PbPhones");

            migrationBuilder.AddColumn<int>(
                name: "PhoneTypeId",
                table: "PbPhones",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_PbPhones_PhoneTypeId",
                table: "PbPhones",
                column: "PhoneTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_PbPhones_PbPhoneType_PhoneTypeId",
                table: "PbPhones",
                column: "PhoneTypeId",
                principalTable: "PbPhoneType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PbPhones_PbPhoneType_PhoneTypeId",
                table: "PbPhones");

            migrationBuilder.DropIndex(
                name: "IX_PbPhones_PhoneTypeId",
                table: "PbPhones");

            migrationBuilder.DropColumn(
                name: "PhoneTypeId",
                table: "PbPhones");

            migrationBuilder.AddColumn<byte>(
                name: "Type",
                table: "PbPhones",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);
        }
    }
}
