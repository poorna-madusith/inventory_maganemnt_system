using HocGadgetShopApi.Models;
using System.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;

namespace HocGadgetShopApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {

        [HttpPost]
        public ActionResult SaveCustomerData([FromBody] CustomerRequestDto requestDto)
        {
            using SqlConnection connection = new SqlConnection
            {
                ConnectionString = @"Server=POORNA95\MSSQLSERVER01;Database=gadgetShop;Trusted_Connection=True;Encrypt=False"
            };

            using SqlCommand command = new SqlCommand
            {
                CommandText = "sp_SaveCustomerDetails",
                CommandType = CommandType.StoredProcedure,
                Connection = connection
            };

            command.Parameters.AddWithValue("@CustomerId", requestDto.CustomerId);
            command.Parameters.AddWithValue("@FirstName", requestDto.FirstName);
            command.Parameters.AddWithValue("@LastName", requestDto.LastName);
            command.Parameters.AddWithValue("@Email", requestDto.Email);
            command.Parameters.AddWithValue("@RegistrationDate", requestDto.RegistrationDate);
            command.Parameters.AddWithValue("@Phone", requestDto.Phone);

            connection.Open();
            command.ExecuteNonQuery();

            return Ok();
        }
        [HttpGet]
        public ActionResult GetCustomerData()
        {
            using SqlConnection connection = new SqlConnection
            {
                ConnectionString = @"Server=POORNA95\MSSQLSERVER01;Database=gadgetShop;Trusted_Connection=True;Encrypt=False"
            };

            using SqlCommand command = new SqlCommand
            {
                CommandText = "sp_GetCustomerDetails",
                CommandType = CommandType.StoredProcedure,
                Connection = connection
            };



            connection.Open(); List<CustomerDto> customers = new List<CustomerDto>();

            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    CustomerDto customerDto = new CustomerDto
                    {
                        CustomerId = reader["CustomerId"] != DBNull.Value ? Convert.ToInt32(reader["CustomerId"]) : 0,
                        FirstName = reader["FirstName"]?.ToString() ?? string.Empty,
                        LastName = reader["LastName"]?.ToString() ?? string.Empty,
                        Phone = reader["Phone"]?.ToString() ?? string.Empty,
                        Email = reader["Email"]?.ToString() ?? string.Empty,
                        RegistrationDate = reader["RegistrationDate"] != DBNull.Value ? Convert.ToDateTime(reader["RegistrationDate"]) : DateTime.MinValue
                    };

                    customers.Add(customerDto);
                }

            }
            connection.Close();

            return Ok(customers);
        }



        [HttpDelete]
        public ActionResult DeleteCustomerData(int customerId)
        {
            using SqlConnection connection = new SqlConnection
            {
                ConnectionString = @"Server=POORNA95\MSSQLSERVER01;Database=gadgetShop;Trusted_Connection=True;Encrypt=False"
            };

            using SqlCommand command = new SqlCommand
            {
                CommandText = "sp_DelteCustomerDetails",
                CommandType = CommandType.StoredProcedure,
                Connection = connection
            };

            command.Parameters.AddWithValue("@CustomerId", customerId);


            connection.Open();
            command.ExecuteNonQuery();
            connection.Close();

            return Ok();
        }

        [HttpPut]
        public ActionResult UpdateCustomerData(CustomerRequestDto customerRequest)
        {
            using SqlConnection connection = new SqlConnection
            {
                ConnectionString = @"Server=POORNA95\MSSQLSERVER01;Database=gadgetShop;Trusted_Connection=True;Encrypt=False"
            };

            using SqlCommand command = new SqlCommand
            {
                CommandText = "sp_EditCustomerDetails",
                CommandType = CommandType.StoredProcedure,
                Connection = connection
            };



            connection.Open();

            command.Parameters.AddWithValue("@CustomerId", customerRequest.CustomerId);
            command.Parameters.AddWithValue("@FirstName", customerRequest.FirstName);
            command.Parameters.AddWithValue("@LastName", customerRequest.LastName);
            command.Parameters.AddWithValue("@Email", customerRequest.Email);
            command.Parameters.AddWithValue("@RegistrationDate", customerRequest.RegistrationDate);
            command.Parameters.AddWithValue("@Phone", customerRequest.Phone);

            command.ExecuteNonQuery();

            connection.Close();

            return Ok();  // Let ASP.NET Core handle the serialization
        }
    }
}
