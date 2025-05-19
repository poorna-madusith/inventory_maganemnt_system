using System.Globalization;

namespace HocGadgetShopApi.Models
{
    public class CustomerRequestDto
    {
        public int CustomerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime RegistrationDate { get; set; }

    }
}
