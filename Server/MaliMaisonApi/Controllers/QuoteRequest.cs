using MaliMaisonApi.Data;
using MaliMaisonApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaliMaisonApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class QuoteRequestController : ControllerBase {
    private readonly QuoteRequestDbContext _quoteRequest;
    public QuoteRequestController(QuoteRequestDbContext quoteRequest) {
        _quoteRequest = quoteRequest;
    }

    [Authorize]
    [HttpGet]
    public IEnumerable<QuoteRequest> GetAll() {
        return _quoteRequest.Requests.ToList();
    }

    [Authorize]
    [HttpGet("{id}")]
    public IActionResult GetById(int id) {
        var quoteRequest = _quoteRequest.Requests.Find(id);

        if(quoteRequest == null)    return NotFound();

        return Ok(quoteRequest);
    }

    [HttpPost("quote_request")]
    public IActionResult AddRequest([FromBody] QuoteRequest quoteRequest) {
        if(quoteRequest == null)    return BadRequest();

        _quoteRequest.Requests.Add(quoteRequest);
        _quoteRequest.SaveChanges();

        return CreatedAtAction(nameof(GetById), new{ id = quoteRequest.Id}, quoteRequest);
    }
}