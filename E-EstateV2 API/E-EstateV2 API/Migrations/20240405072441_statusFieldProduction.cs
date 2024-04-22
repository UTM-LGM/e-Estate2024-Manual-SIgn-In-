﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class statusFieldProduction : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "fieldProductions",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "status",
                table: "fieldProductions");
        }
    }
}
