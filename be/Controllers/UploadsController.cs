using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace OKVIP.Controllers
{
    [ApiController]
    [Route("api/image")]
    public class UploadsController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public UploadsController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost("upload")]
        [Authorize]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded or file is empty.");
            }

            try
            {
                // Đường dẫn lưu ảnh
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Tên file duy nhất
                var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName.Replace(" ", "")}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Lưu file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Trả về đường dẫn file
                var fileUrl = $"/uploads/{uniqueFileName}";
                return Ok(new { Success = true, FileUrl = fileUrl});
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
