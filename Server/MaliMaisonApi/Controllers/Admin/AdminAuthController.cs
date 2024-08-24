using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace MaliMaisonApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AuthController : ControllerBase {
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration) {
        _configuration = configuration;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request) {
        var adminUserName = _configuration["AdminCredentials:UserName"];
        var adminPassword = _configuration["AdminCredentials:Password"];

        if(adminUserName == null || adminPassword == null) {
            throw new ArgumentNullException("adminUserName and/or adminPassword can't be null");
        }

        if(request.UserName == adminUserName && request.Password == adminPassword) {
            var token = GenerateJwtToken(adminUserName);
            return Ok(new {Token = token});
        }

        return Unauthorized();
    }

    private string GenerateJwtToken(string username) {
        var jwtkey = _configuration["Jwt:Key"];
        var jwtIssuer = _configuration["Jwt:Issuer"];
        var jwtAudience = _configuration["Jwt:Audience"];

        if (string.IsNullOrEmpty(jwtkey) || string.IsNullOrEmpty(jwtIssuer) || string.IsNullOrEmpty(jwtAudience)) {
                throw new ApplicationException("JWT configuration is missing or invalid.");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtkey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: new[] { new Claim(ClaimTypes.Name, username) },
            expires: DateTime.Now.AddHours(3),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}