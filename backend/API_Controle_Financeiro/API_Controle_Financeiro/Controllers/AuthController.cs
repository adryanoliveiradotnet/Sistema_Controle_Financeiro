using API_Controle_Financeiro.Data;
using API_Controle_Financeiro.DTOs;
using API_Controle_Financeiro.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API_Controle_Financeiro.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }
    // POST: api/auth/cadastro
    [HttpPost("cadastro")]
    public async Task<IActionResult> Cadastro([FromBody] AuthDTO dto)
    {
        if (await _context.Usuarios.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email já cadastrado.");

        var usuario = new Usuario
        {
            Nome = dto.Nome ?? string.Empty,
            Email = dto.Email,
            Senha = BCrypt.Net.BCrypt.HashPassword(dto.Senha)
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return Ok("Usuário cadastrado com sucesso!");
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthDTO dto)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.Senha))
            return Unauthorized("Email ou senha inválidos.");

        var token = GerarToken(usuario);
        return Ok(new { token });
    }

    private string GerarToken(Usuario usuario)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Email, usuario.Email),
            new Claim(ClaimTypes.Name, usuario.Nome)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}