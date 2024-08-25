using MaliMaisonApi.Data;
using MaliMaisonApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using System.Net.Mail;
using System.Net.Mime;
using System.IO;

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

        string pdfPath = GeneratePdf(quoteRequest);

        if(quoteRequest.Email == null)      throw new ArgumentNullException("Email can't be null");

        bool emailSent = SendEmailWithPdf(quoteRequest.Email, pdfPath);

        if(!emailSent)     return StatusCode(500, "failed to send email");

        return CreatedAtAction(nameof(GetById), new{ id = quoteRequest.Id}, quoteRequest);
    }

    private string GeneratePdf(QuoteRequest quoteRequest) {
        string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "pdf", $"Quote_{quoteRequest.Id}.pdf");

        using(PdfWriter writer = new PdfWriter(filePath)) {
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.Add(new Paragraph("Devis"));
            document.Add(new Paragraph($"Prenom et Nom: Mr/Mme {quoteRequest.FirstName} {quoteRequest.Name}"));
            document.Add(new Paragraph($"Email: {quoteRequest.Email}"));
            document.Add(new Paragraph($"Date: {quoteRequest.RequestTime}"));
            document.Add(new Paragraph($"Produits: "));

            foreach(var product in quoteRequest.Cameras)
                document.Add(new Paragraph($"{product.Name} | {product.Model} | {product.Price:C}"));

            document.Add(new Paragraph($"Total Price: {quoteRequest.ToltalPrice:C}"));

            document.Close();
        }
            return filePath;
    }

    private bool SendEmailWithPdf(string recipientEmail, string pdfPath) {
        try {
            using(MailMessage mail = new MailMessage()) {
                mail.From = new MailAddress("traoredjobengs22@gmail.com");
                mail.To.Add(recipientEmail);
                mail.Subject = "Votre devis gratuit";
                mail.Body = "Veuillez trouver ci-joint votre devis";
                mail.IsBodyHtml = true;

                Attachment attachment = new Attachment(pdfPath, MediaTypeNames.Application.Pdf);
                mail.Attachments.Add(attachment);

                using(SmtpClient smtp = new SmtpClient("smtp.gmail.com", 25)) {
                    smtp.Credentials = new System.Net.NetworkCredential("traoredjobengs22@gmail.com", "tiemokotraore");
                    smtp.EnableSsl = true;
                    smtp.Send(mail);
                }
            }
                return true;
        } catch(Exception) {
            return false;
        }
    }
}