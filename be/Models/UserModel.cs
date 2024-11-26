namespace OKVIP.Models
{
    public class User
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Fullname { get; set; }
        public string Password { get; set; }
    }

    public class UserViewModel
    {
        public string Username { get; set; }
        public string Fullname { get; set; }
       
    }

    public class AuthResponse
    {
        public UserViewModel User { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
    public class RefreshTokenResponse
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
