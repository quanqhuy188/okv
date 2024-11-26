using Microsoft.Data.Sqlite;

namespace OKVIP.Services
{
    public static class DatabaseInitializer
    {
        public static void CreateDatabase()
        {
            // Đường dẫn tới file SQLite
            var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "okvip.db");

            // Kiểm tra nếu database chưa tồn tại
            if (!File.Exists(dbPath))
            {
                using (var connection = new SqliteConnection($"Data Source={dbPath}"))
                {
                    connection.Open();

                    var createTableCmd = connection.CreateCommand();
                    createTableCmd.CommandText = @"
                        CREATE TABLE IF NOT EXISTS Users (
                            Id TEXT PRIMARY KEY,
                            Username TEXT NOT NULL,       
                            Fullname TEXT NOT NULL,      
                            Password TEXT NOT NULL       
                        );
                        CREATE TABLE IF NOT EXISTS Products (
                            Id TEXT PRIMARY KEY,
                            ImageUrl TEXT NOT NULL,       
                            Price TEXT NOT NULL,      
                            Name TEXT NOT NULL,    
                            UserId TEXT NOT NULL       
                        );
                    ";
                    createTableCmd.ExecuteNonQuery();

                    Console.WriteLine("Database and table created successfully!");
                }
            }
            else
            {
                Console.WriteLine("Database already exists!");
            }
        }
    }
}
