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
using SendGrid;
using SendGrid.Helpers.Mail;

namespace MaliMaisonApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class QuoteRequestController : ControllerBase {
    private readonly QuoteRequestDbContext _quoteRequest;
    public QuoteRequestController(QuoteRequestDbContext quoteRequest) {
        _quoteRequest = quoteRequest;
    }

    //[Authorize]
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

        bool emailSent = SendEmailWithSendGrid(quoteRequest.Email, pdfPath).Result;

        if(!emailSent)     return StatusCode(500, "failed to send email");

        return CreatedAtAction(nameof(GetById), new{ id = quoteRequest.Id}, quoteRequest);
    }

private string GeneratePdf(QuoteRequest quoteRequest) {
    string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "pdf", $"Quote_{quoteRequest.FirstName}.pdf");

    using(PdfWriter writer = new PdfWriter(filePath)) {
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Ajout de l'adresse et du destinataire
        document.Add(new Paragraph($"À ").SetFontSize(24).SetBold());

        document.Add(new Paragraph($"Mr./Mme {quoteRequest.FirstName} {quoteRequest.Name}"));

        document.Add(new Paragraph($"Email: {quoteRequest.Email}"));
        document.Add(new Paragraph($"Date: {quoteRequest.RequestTime}"));
        document.Add(new Paragraph("\n"));

        // Création de la table
        Table table = new Table(4); // 4 colonnes
        table.AddHeaderCell("QTE");
        table.AddHeaderCell("DESCRIPTION+Model");
        table.AddHeaderCell("PRIX UNITAIRE");
        table.AddHeaderCell("TOTAL DE LA LIGNE");

        decimal totalPrice = 0;

        foreach(var product in quoteRequest.Cameras) {
            table.AddCell("1"); // Quantité
            table.AddCell($"{product.Name} | {product.Model}"); // Description + Model
            table.AddCell($"{product.Price:C}"); // Prix Unitaire
            table.AddCell($"{product.Price:C}"); // Total de la ligne (Quantité x Prix unitaire)
            totalPrice += product.Price;
        }

        // Ajout d'une cellule pour le total général
        table.AddCell(new Cell(1, 3).Add(new Paragraph("TOTAL").SetBold()));
        table.AddCell(new Cell().Add(new Paragraph($"{totalPrice:C}").SetBold()));

        document.Add(table);

        // Ajout du message de remerciement
        document.Add(new Paragraph("\n\nNOUS VOUS REMERCIONS DE VOTRE CONFIANCE.").SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER));

        document.Close();
    }
    return filePath;
}


     private async Task<bool> SendEmailWithSendGrid(string recipientEmail, string pdfPath) {
            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            Console.WriteLine(apiKey);
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("traoredjobengs22@gmail.com", "MaliMaison");
            var subject = "Votre devis gratuit";
            var to = new EmailAddress(recipientEmail);
            var plainTextContent = "Veuillez trouver ci-joint votre devis";
            var htmlContent = "<strong>Veuillez trouver ci-joint votre devis</strong>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);

            using (var fileStream = new FileStream(pdfPath, FileMode.Open, FileAccess.Read)) {
                var bytes = new byte[fileStream.Length];
                fileStream.Read(bytes, 0, (int)fileStream.Length);
                msg.AddAttachment("Quote.pdf", Convert.ToBase64String(bytes), "application/pdf");
            }

                var response = await client.SendEmailAsync(msg);
                var responseBody = await response.Body.ReadAsStringAsync(); // Lire le corps de la réponse

                // Affichez les détails de la réponse dans la console
                Console.WriteLine($"Response Status Code: {response.StatusCode}");
                Console.WriteLine($"Response Body: {responseBody}");

                return response.StatusCode == System.Net.HttpStatusCode.OK || 
                    response.StatusCode == System.Net.HttpStatusCode.Accepted;
                    }
    }