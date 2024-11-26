
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OKVIP.Models;
using OKVIP.Services;

namespace OKVIP.Controllers
{
    [ApiController]
    [Route("api/product")]
    public class ProductController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly IProductService _prodService;
        public ProductController(
            IProductService prodService
            )
        {
            _prodService = prodService;
        }
        [HttpPost("create")]
        [Authorize]

        public async Task<IActionResult> Create([FromBody] CreateProductReq model)
        {
            try
            {

                var response = await _prodService.CreateAsync(model);
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
        [HttpGet("get")]
        [Authorize]

        public async Task<IActionResult> Get()
        {
            try
            {

                var response = await _prodService.Get();
                if (!response.IsOk)
                {
                    return StatusCode(response.StatusCode, new { message = response.Description });
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }

        }
        [HttpGet("get-by-id")]
        [Authorize]

        public async Task<IActionResult> GetById(string id)
        {
            try
            {

                var response = await _prodService.GetById(id);
                if (!response.IsOk)
                {
                    return StatusCode(response.StatusCode, new { message = response.Description });
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }

        }

    }
}