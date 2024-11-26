using Microsoft.EntityFrameworkCore;
using OKVIP.Models;

namespace OKVIP.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetByIdAsync(string id);

        Task<User> GetByUsernameAsync(string username);
        Task AddAsync(User user);
        Task SaveAsync();
    }

    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetByIdAsync(string id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> GetByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }   

        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
