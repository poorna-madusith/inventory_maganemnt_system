using System.Data;
using Microsoft.Data.SqlClient;
using HocGadgetShopApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace HocGadgetShopApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        [HttpPost]
        [Consumes("application/json")]
        public ActionResult SaveInventoryData([FromBody] InventoryRequestDto requestDto)
        {
            using SqlConnection connection = new SqlConnection
            {
                ConnectionString = @"Server=POORNA95\MSSQLSERVER01;Database=gadgetShop;Trusted_Connection=True;Encrypt=False"
            };

            using SqlCommand command = new SqlCommand
            {
                CommandText = "sp_SaveInventoryData",
                CommandType = CommandType.StoredProcedure,
                Connection = connection
            };

            command.Parameters.AddWithValue("@ProductId", requestDto.ProductId);
            command.Parameters.AddWithValue("@ProductName", requestDto.ProductName);
            command.Parameters.AddWithValue("@AvailableQty", requestDto.AvailableQty);
            command.Parameters.AddWithValue("@ReorderPoint", requestDto.ReorderPoint);

            connection.Open();
            command.ExecuteNonQuery();

            return Ok();
        }

        [HttpGet]
        public ActionResult GetInventoryData()
        {
            using SqlConnection connection = new SqlConnection
            {
                ConnectionString = @"Server=POORNA95\MSSQLSERVER01;Database=gadgetShop;Trusted_Connection=True;Encrypt=False"
            };

            using SqlCommand command = new SqlCommand
            {
                CommandText = "sp_GetInventoryData",
                CommandType = CommandType.StoredProcedure,
                Connection = connection
            };

            List<InventoryDto> response = new List<InventoryDto>();

            connection.Open();
            using (SqlDataReader sqlDataReader = command.ExecuteReader())
            {
                while (sqlDataReader.Read())
                {
                    InventoryDto inventoryDto = new InventoryDto();

                    inventoryDto.ProductId = Convert.ToInt32(sqlDataReader["ProductId"]);
                    inventoryDto.ProductName = Convert.ToString(sqlDataReader["ProductName"]) ?? string.Empty;
                    inventoryDto.AvailableQty = Convert.ToInt32(sqlDataReader["AvailableQty"]);
                    inventoryDto.ReorderPoint = Convert.ToInt32(sqlDataReader["ReorderPoint"]);

                    response.Add(inventoryDto);
                }
            }

            connection.Close();

            return Ok(response);  // Let ASP.NET Core handle the serialization
        }

        [HttpDelete]
        public ActionResult DeleteInventoryData (int productId)
        {
            using SqlConnection connection = new SqlConnection
            {
                ConnectionString = @"Server=POORNA95\MSSQLSERVER01;Database=gadgetShop;Trusted_Connection=True;Encrypt=False"
            };

            using SqlCommand command = new SqlCommand
            {
                CommandText = "sp_DeleteInventoryDetails",
                CommandType = CommandType.StoredProcedure,
                Connection = connection
            };

            

            connection.Open();

            command.Parameters.AddWithValue("@ProductId", productId);

            command.ExecuteNonQuery();

            connection.Close();

            return Ok();  // Let ASP.NET Core handle the serialization
        }



        [HttpPut]
        public ActionResult UpdateInventoryData(InventoryRequestDto inventoryRequest)
        {
            using SqlConnection connection = new SqlConnection
            {
                ConnectionString = @"Server=POORNA95\MSSQLSERVER01;Database=gadgetShop;Trusted_Connection=True;Encrypt=False"
            };

            using SqlCommand command = new SqlCommand
            {
                CommandText = "sp_UpdateInventoryData",
                CommandType = CommandType.StoredProcedure,
                Connection = connection
            };



            connection.Open();

            command.Parameters.AddWithValue("@ProductId", inventoryRequest.ProductId);
            command.Parameters.AddWithValue("@ProductName", inventoryRequest.ProductName);
            command.Parameters.AddWithValue("@AvailableQty", inventoryRequest.AvailableQty);
            command.Parameters.AddWithValue("@ReOrderPoint", inventoryRequest.ReorderPoint);

            command.ExecuteNonQuery();

            connection.Close();

            return Ok();  // Let ASP.NET Core handle the serialization
        }



    }
}
