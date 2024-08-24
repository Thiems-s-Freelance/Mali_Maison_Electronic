
using System.Text;
using MaliMaisonApi.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace MaliMaisonApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var connectionString = builder.Configuration.GetConnectionString("CameraConnection")
                ?? throw new ArgumentNullException("CameraConnection", "DefaultConnection is not configured");

            var userConnection = builder.Configuration.GetConnectionString("QuoteRequestConnection")
                ?? throw new ArgumentNullException("QuoteRequestConnection", "UserConnection is not configured");

            builder.Services.AddDbContext<CameraDbContext>(options => 
                    options.UseSqlServer(connectionString));

            builder.Services.AddDbContext<QuoteRequestDbContext>(options =>
                    options.UseSqlServer(userConnection));

            var jwtkey = builder.Configuration["jwt:key"]
                ?? throw new ArgumentNullException("Jwt:Key", "Jwt:Key is not configured");

            if(jwtkey.Length < 32) {
                throw new ArgumentException("Jwt:Key must be at least 32 characters long.");
            }

            var jwtissuer = builder.Configuration["jwt:Issuer"]
                ?? throw new ArgumentNullException("Jwt:Issuer", "Jwt:Issuer is not configured");
            
            var jwtAudience = builder.Configuration["jwt:Audience"]
                ?? throw new ArgumentNullException("Jwt:Audience", "Jwt:Audience is not configured");

            var key = Encoding.UTF8.GetBytes(jwtkey);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtissuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtkey))
                };
            });

            builder.Services.AddCors(options => {
                options.AddPolicy("AllowSpecificOrigin",
                builder => builder.WithOrigins("http://localhost:5170")
                                  .AllowAnyHeader()
                                  .AllowAnyMethod()
                                  .AllowCredentials());
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseAuthentication();

            app.UseCors("AllowSpecificOrigin");

            app.MapControllers();

            app.Run();
        }
    }
}
