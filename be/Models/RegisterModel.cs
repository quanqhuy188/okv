namespace OKVIP.Models
{
    public class RegisterModel
    {
        public string Username { get; set; }
        public string Fullname { get; set; }
        public string Password { get; set; }

        public string ConfirmPassword { get; set; }
    }
    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class TokenRequest
    {
        public string RefreshToken { get; set; }

    }
}
