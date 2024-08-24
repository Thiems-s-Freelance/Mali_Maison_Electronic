using MaliMaisonApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MaliMaisonApi.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<CameraDbContext> {
        public CameraDbContext CreateDbContext(string[] args) {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("CameraConnection");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Connection string 'CameraConnection' Not found.");
            }

            var optionsBuilder = new DbContextOptionsBuilder<CameraDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new CameraDbContext(optionsBuilder.Options);
        }
}

public class QuoteDesignTimeDbContextFactory : IDesignTimeDbContextFactory<QuoteRequestDbContext> {
        public QuoteRequestDbContext CreateDbContext(string[] args) {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("QuoteRequestConnection");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Connection string 'QuoteRequestConnection' Not found.");
            }

            var optionsBuilder = new DbContextOptionsBuilder<QuoteRequestDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new QuoteRequestDbContext(optionsBuilder.Options);
        }
}

public class CameraDbContext : DbContext {
    public CameraDbContext (DbContextOptions<CameraDbContext> options) : base(options) { }
    public DbSet<Camera> Cameras { get; set; } = null!;
}

public class QuoteRequestDbContext : DbContext {
    public QuoteRequestDbContext (DbContextOptions<QuoteRequestDbContext> options) : base(options) { }
    public DbSet<QuoteRequest> Requests { get; set; } = null!;
}