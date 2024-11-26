using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using OKVIP.Models;
using OKVIP.Services;

namespace OKVIP.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly IUserService _userService;
        public AuthController(
            AuthService authService,
            IUserService userService
            )
        {
            _authService = authService;
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {

            try
            {

                var response = await _userService.RegisterAsync(model);
                if (!response.IsOk)
                {
                    return StatusCode(response.StatusCode, new { message = response.Description } );
                }

                return Ok(response.Data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {

            try
            {

                var response = await _userService.LoginAsync(model);

                if (!response.IsOk)
                {
                    return StatusCode(response.StatusCode, new { message = response.Description });
                }

                return Ok(response.Data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }

        [HttpPost("refresh-token")]

        public async Task<IActionResult> RefreshToken([FromBody] TokenRequest model)
        {

            try
            {

                var response = await _userService.RefreshTokenAsync(model);

                if (!response.IsOk)
                {
                    return StatusCode(response.StatusCode, new { message = response.Description });
                }

                return Ok(response.Data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }
    }
}