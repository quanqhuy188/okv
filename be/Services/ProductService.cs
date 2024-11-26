using Microsoft.AspNetCore.Identity.Data;
using OKVIP.Libraries;
using OKVIP.Models;
using OKVIP.Repositories;
using System.Security.Claims;

namespace OKVIP.Services
{
    public interface IProductService
    {
        Task<ObjectReturnCode<Product>> CreateAsync(CreateProductReq model);

        Task<ObjectReturnCode<ProductList>> Get();

        Task<ObjectReturnCode<Product>> GetById(string id);

    }

    public class ProductService : IProductService
    {
        private readonly IProductRepository _prodRepository;
        private readonly AuthService _authService;

        public ProductService(IProductRepository prodRepository, AuthService authService)
        {
            _prodRepository = prodRepository;
            _authService = authService;
        }
        public async Task<ObjectReturnCode<ProductList>> Get()
        {
            var response = new ObjectReturnCode<ProductList>();


            var products = await _prodRepository.GetAllAsync();
            var productList = new ProductList
            {
                Products = products.ToList() 
            };
            response.Code = ErrorCode.None;
            response.Description = "Successfully retrieved products.";
            response.Data = productList;

            return response;
        }

        public async Task<ObjectReturnCode<Product>> GetById(string id)
        {
            var response = new ObjectReturnCode<Product>();

            var product = await _prodRepository.GetByIdAsync(id);

            if (product == null)
            {

                response.Code = ErrorCode.Common_NotFound;
                response.Description = "Sản phẩm không tồn tại";
            }
            else
            {

                response.Code = ErrorCode.None;
                response.Description = "Lấy sản phẩm thành công";
                response.Data = product;
            }

            return response;
        }

        public async Task<ObjectReturnCode<Product>> CreateAsync(CreateProductReq model)
        {
            var response = new ObjectReturnCode<Product>();
            var product = new Product
            {
                Id = Guid.NewGuid().ToString(),
                Price = model.Price,
                ImageUrl = model.ImageUrl,
                UserId = model.UserId,
                Name = model.Name,
            };
            response.Code = ErrorCode.None;
            response.Description = "Thêm sản phẩm thành công";
            response.Data = product;
            await _prodRepository.AddAsync(product);
            await _prodRepository.SaveAsync();


            return response;
        }
        // Thêm các phương thức khác như UpdateUser, DeleteUser nếu cần
    }

}
