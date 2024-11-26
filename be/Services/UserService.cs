using Microsoft.AspNetCore.Identity.Data;
using OKVIP.Libraries;
using OKVIP.Models;
using OKVIP.Repositories;
using System.Security.Claims;

namespace OKVIP.Services
{
    public interface IUserService
    {

        Task<ObjectReturnCode<AuthResponse>> RefreshTokenAsync(TokenRequest model);
        Task<User> GetUserByIdAsync(string userId);

        Task<ObjectReturnCode<AuthResponse>> RegisterAsync(RegisterModel model);

        Task<ObjectReturnCode<AuthResponse>> LoginAsync(LoginModel model);

    }

    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly AuthService _authService;

        public UserService(IUserRepository userRepository, AuthService authService)
        {
            _userRepository = userRepository;
            _authService = authService;
        }
        public async Task<ObjectReturnCode<AuthResponse>> RegisterAsync(RegisterModel model)
        {
            var response = new ObjectReturnCode<AuthResponse>();

     
            var existingUser =  await _userRepository.GetByUsernameAsync(model.Username);
            if (existingUser != null)
            {
                response.Code = ErrorCode.Common_Existed;
                response.Description = $"Người dùng với tên đăng nhập '{model.Username}' đã tồn tại.";
                return response;
            }
            var hashedPassword = _authService.HashPassword(model.Password);
         
            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = model.Username,
                Password = hashedPassword,
                Fullname = model.Fullname
            };

         
            _userRepository.AddAsync(user);
            _userRepository.SaveAsync();

        
            var accessToken = _authService.GenerateAccessToken(user.Id);
            var refreshToken = _authService.GenerateRefreshToken(user.Id);

            response.Data = new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = new UserViewModel
                {
                    Username = model.Username,
                    Fullname = model.Fullname
                }
            }; 
            response.Code = ErrorCode.None;
            response.Description = "Đăng ký thành công";

            return response;
        }

        public async Task<ObjectReturnCode<AuthResponse>> LoginAsync(LoginModel model)
        {
            var response = new ObjectReturnCode<AuthResponse>();

            var existingUser = await _userRepository.GetByUsernameAsync(model.Username);
            if (existingUser == null)
            {
                response.Code = ErrorCode.Common_NotFound;
                response.Description = $"Người dùng với tên đăng nhập '{model.Username}' không tồn tại.";
                return response;
            }


            var verifyPassword = _authService.VerifyPassword(model.Password, existingUser.Password);
            if (!verifyPassword)
            {
                response.Code = ErrorCode.Common_Invalid;  
                response.Description = "Sai mật khẩu.";
                return response;
                
            }


      
            var accessToken = _authService.GenerateAccessToken(existingUser.Id);
            var refreshToken = _authService.GenerateRefreshToken(existingUser.Id);

            response.Data = new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = new UserViewModel
                {
                    Username = existingUser.Username,
                    Fullname = existingUser.Fullname
                }
            };
            response.Code = ErrorCode.None;
            response.Description = "Đăng nhập thành công";

            return response;
        }



        public async Task<ObjectReturnCode<AuthResponse>> RefreshTokenAsync(TokenRequest model)
        {
            var response = new ObjectReturnCode<AuthResponse>();
            ClaimsPrincipal principal = null;
            try
            {
                principal = _authService.GetPrincipalFromExpiredToken(model.RefreshToken);
            }
            catch (UnauthorizedAccessException ex)
            {
                response.Code = ErrorCode.System_TokenExpired;
                response.Description = "Token khong hợp lệ.";
                return response;
            }


            if (principal == null)
            {
                response.Code = ErrorCode.System_TokenExpired;
                response.Description = "Token khong hợp lệ.";
                return response;
            }

            var userId = principal.Identity.Name;
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                response.Code = ErrorCode.System_TokenExpired;
                response.Description = "Token khong hợp lệ.";
                return response;
            }


            var accessToken = _authService.GenerateAccessToken(user.Id);
            var refreshToken = _authService.GenerateRefreshToken(user.Id);

            response.Data = new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = new UserViewModel
                {
                    Username = user.Username,
                    Fullname = user.Fullname
                }
            };
            response.Code = ErrorCode.None;
            response.Description = "Thành công";
            return response;

        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            return await _userRepository.GetByIdAsync(userId);
        }

      
    }

}
