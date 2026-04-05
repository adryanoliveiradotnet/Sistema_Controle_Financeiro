using Microsoft.EntityFrameworkCore;
using API_Controle_Financeiro.Models;

namespace API_Controle_Financeiro.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Transacao> Transacoes { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
}