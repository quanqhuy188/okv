using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.IdentityModel.Tokens;
using OKVIP.Models;

public class AuthService

{
    private readonly string _accessTokenSecret;
    private readonly string _refreshTokenSecret;
    private readonly int _accessTokenExpirationMinutes;
    private readonly int _refreshTokenExpirationDays;

    public AuthService(IConfiguration configuration)
    {
        _accessTokenSecret = configuration["JWT:AccessTokenSecret"];
        _refreshTokenSecret = configuration["JWT:RefreshTokenSecret"];
        _accessTokenExpirationMinutes = int.Parse(configuration["JWT:AccessTokenExpirationMinutes"]);
        _refreshTokenExpirationDays = int.Parse(configuration["JWT:RefreshTokenExpirationDays"]);
    }

    public string GenerateAccessToken(string userId)
    {
        return GenerateToken(userId, Convert.ToInt32(_accessTokenExpirationMinutes), _accessTokenSecret);
    }


    public string GenerateRefreshToken(string userId)
    { 
        return GenerateToken(userId, Convert.ToInt32(_refreshTokenExpirationDays * 24 * 60), _refreshTokenSecret); 
    }


    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true, 
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_refreshTokenSecret)),
            ClockSkew = TimeSpan.Zero
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        try
        {
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);
            return principal;
        }
        catch (SecurityTokenExpiredException)
        {
        
            throw new Exception("Token has expired.");
        }
        catch (SecurityTokenInvalidSignatureException)
        {

            throw new Exception("Token has an invalid signature.");
        }
        catch (Exception ex)
        {
            
            throw new Exception($"Token validation failed: {ex.Message}");
        }
    }
    private string GenerateToken(string userId, int expiresIn,string secret)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), 
            new Claim(ClaimTypes.Name, userId)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);



        var token = new JwtSecurityToken(
            issuer: "",
            audience: "your-app",
            claims: claims,
            expires: DateTime.Now.AddMinutes(expiresIn),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }



   
    public string HashPassword(string password)
    {
       
        byte[] salt = new byte[128 / 8];
        using (var rng = new RNGCryptoServiceProvider())
        {
            rng.GetBytes(salt); // Lấy một salt ngẫu nhiên
        }

        
        string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA512,
            iterationCount: 10000,
            numBytesRequested: 256 / 8));

       
        return Convert.ToBase64String(salt) + "." + hashedPassword;
    }

   
    public bool VerifyPassword(string enteredPassword, string storedHash)
    {
      
        var parts = storedHash.Split('.');
        if (parts.Length != 2)
        {
            return false; 
        }

        byte[] salt = Convert.FromBase64String(parts[0]);
        string storedPasswordHash = parts[1];

       
        string enteredPasswordHash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: enteredPassword,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA512,
            iterationCount: 10000,
            numBytesRequested: 256 / 8));

        return storedPasswordHash == enteredPasswordHash;
    }


}
