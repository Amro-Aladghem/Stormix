using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Stormix.Api.ContextFactory
{
    public class AppContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Development.json")
                .Build();

            var builder = new DbContextOptionsBuilder<AppDbContext>()
                .UseNpgsql(config.GetSection("sql_connection").Value, b => b.MigrationsAssembly("Stormix.Api"));

            return new AppDbContext(builder.Options);
        }
    }
}
