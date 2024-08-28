using MaliMaisonApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MaliMaisonApi.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext> {
        public ApplicationDbContext CreateDbContext(string[] args) {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Connection string 'DefaultConnection' Not found.");
            }

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new ApplicationDbContext(optionsBuilder.Options);
        }
}

public class ApplicationDbContext : DbContext {
    public ApplicationDbContext (DbContextOptions<ApplicationDbContext> options) : base(options) { }
    public DbSet<Camera> Cameras { get; set; } = null!;
    public DbSet<QuoteRequest> Requests { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        // Configure la précision et l'échelle pour la colonne Price
        modelBuilder.Entity<Camera>()
            .Property(c => c.Price)
            .HasPrecision(18, 2); // Précision de 18 chiffres, dont 2 après la virgule

        // Configurez d'autres entités et propriétés ici si nécessaire

        base.OnModelCreating(modelBuilder);
    }
}