namespace API_Controle_Financeiro.Models
{
    public class Transacao
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        public DateTime Data { get; set; }
        public string? Categoria { get; set; }
    }
    public enum TipoTransacao
    {
        Entrada,
        Saida
    }
}
