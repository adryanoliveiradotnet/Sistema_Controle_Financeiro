namespace API_Controle_Financeiro.DTOs;

public class AuthDTO
{
    public string? Nome { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
}