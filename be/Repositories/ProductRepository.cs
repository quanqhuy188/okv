using Microsoft.EntityFrameworkCore;
using OKVIP.Models;

namespace OKVIP.Repositories
{
    public interface IProductRepository
    {
        Task<Product> GetByIdAsync(string id);
        Task<IEnumerable<Product>> GetAllAsync();
        Task AddAsync(Product prod);
        Task SaveAsync();
    }

    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Product> GetByIdAsync(string id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            
            return await _context.Products.ToListAsync();
        }

        public async Task AddAsync(Product prod)
        {
            await _context.Products.AddAsync(prod);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
