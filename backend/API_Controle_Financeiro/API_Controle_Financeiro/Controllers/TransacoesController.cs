using API_Controle_Financeiro.Data;
using API_Controle_Financeiro.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API_Controle_Financeiro.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/transacoes
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var transacoes = await _context.Transacoes
            .OrderByDescending(t => t.Data)
            .ToListAsync();
        return Ok(transacoes);
    }

    // GET: api/transacoes/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var transacao = await _context.Transacoes.FindAsync(id);
        if (transacao == null) return NotFound();
        return Ok(transacao);
    }

    // POST: api/transacoes
    [HttpPost]
    public async Task<IActionResult> Create(Transacao transacao)
    {
        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = transacao.Id }, transacao);
    }

    // PUT: api/transacoes/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Transacao transacao)
    {
        if (id != transacao.Id) return BadRequest();
        _context.Entry(transacao).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/transacoes/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var transacao = await _context.Transacoes.FindAsync(id);
        if (transacao == null) return NotFound();
        _context.Transacoes.Remove(transacao);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    [HttpDelete]
    public async Task<IActionResult> DeleteAll()
    {
        _context.Transacoes.RemoveRange(_context.Transacoes);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}