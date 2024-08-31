using MaliMaisonApi.Data;
using MaliMaisonApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using SendGrid;
using SendGrid.Helpers.Mail;
using iText.Layout.Properties;
using iText.IO.Image;

namespace MaliMaisonApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuoteRequestController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public QuoteRequestController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpGet]
    public IEnumerable<QuoteRequest> GetAll()
    {
        return _context.Requests.ToList();
    }

    [Authorize]
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var quoteRequest = _context.Requests.Find(id);

        if (quoteRequest == null) return NotFound();

        return Ok(quoteRequest);
    }

    [HttpPost()]
    public IActionResult AddRequest([FromBody] QuoteRequest quoteRequest)
    {
        if (quoteRequest == null || string.IsNullOrEmpty(quoteRequest.Email))
            return BadRequest("invalid request data");

        var camerasToAdd = new List<QuoteRequestCamera>();

        foreach (var product in quoteRequest.Products)
        {
            var camera = _context.Cameras.Find(product.ProductId);

            if(camera == null)      return BadRequest($"Camera with ID {product.ProductId} does not exitst");

            if(product.Quantity > camera.Stock)     return BadRequest($"stock is insufficient for {camera.Name} ({camera.Model})");

            var quoteRequestCamera = new QuoteRequestCamera {
                ProductId = camera.Id,
                Quantity = product.Quantity,
                Camera = camera
            };

            camerasToAdd.Add(quoteRequestCamera);
        }

        quoteRequest.RequestTime = DateTime.Now;
        quoteRequest.Products = camerasToAdd;

        _context.Requests.Add(quoteRequest);
        _context.SaveChanges();

        // Génération du PDF
        string pdfPath;
        try
        {
            pdfPath = GeneratePdf(quoteRequest);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erreur lors de la génération du PDF : {ex.Message}");
        }

        if (quoteRequest.Email == null)
            return BadRequest("L'email ne peut pas être nul.");

        bool emailSent;
        try
        {
            emailSent = SendEmailWithSendGrid(quoteRequest.Email, pdfPath).Result;
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erreur lors de l'envoi de l'email : {ex.Message}");
        }

        if (!emailSent)
            return StatusCode(500, "Échec de l'envoi de l'email.");

        return CreatedAtAction(nameof(GetById), new { id = quoteRequest.Id }, quoteRequest);
    }

    private string GeneratePdf(QuoteRequest quoteRequest)
    {
        string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "pdf", $"Devis_{quoteRequest.FirstName}.pdf");

        using (PdfWriter writer = new PdfWriter(filePath))
        {
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            string logoPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Img", "Mali_Maison_Logo.jpg");
            ImageData imageData = ImageDataFactory.Create(logoPath);
            Image logo = new Image(imageData);

            // Récupérer les dimensions de la page
            var pageSize = pdf.GetDefaultPageSize();
            float x = pageSize.GetWidth() - 105; // Ajuster la position en X (100 pixels à gauche du bord droit)
            float y = pageSize.GetHeight() - 100; // Ajuster la position en Y (100 pixels en dessous du bord supérieur)

            // Placer l'image à la position souhaitée
            logo.SetFixedPosition(x, y);
            logo.ScaleToFit(100, 100); // Ajuster la taille de l'image si nécessaire
            document.Add(logo);

            // Ajout de l'adresse et du destinataire
            document.Add(new Paragraph($"À ").SetFontSize(24).SetBold());
            document.Add(new Paragraph($"Mr./Mme {quoteRequest.FirstName} {quoteRequest.Name}"));
            document.Add(new Paragraph($"Email: {quoteRequest.Email}"));
            document.Add(new Paragraph($"Date: {quoteRequest.RequestTime}"));
            document.Add(new Paragraph("\n"));

            // Création de la table
            Table table = new Table(4); // 4 colonnes
            table.AddHeaderCell("QTE").SetTextAlignment(TextAlignment.CENTER);
            table.AddHeaderCell("DESCRIPTION+Model").SetTextAlignment(TextAlignment.CENTER);
            table.AddHeaderCell("PRIX UNITAIRE").SetTextAlignment(TextAlignment.CENTER);
            table.AddHeaderCell("TOTAL DE LA LIGNE").SetTextAlignment(TextAlignment.CENTER);

            decimal totalPrice = 0;
            decimal totalLine;

            foreach (var product in quoteRequest.Products)
            {
                table.AddCell(new Cell().Add(new Paragraph($"{product.Quantity}")).SetTextAlignment(TextAlignment.CENTER)); // Quantité
                table.AddCell(new Cell().Add(new Paragraph($"{product.Camera.Name} | {product.Camera.Model}")).SetTextAlignment(TextAlignment.CENTER)); // Description + Model
                table.AddCell(new Cell().Add(new Paragraph($"{product.Camera.Price:C}")).SetTextAlignment(TextAlignment.CENTER)); // Prix Unitaire

                totalLine = product.Camera.Price * product.Quantity;
                table.AddCell(new Cell().Add(new Paragraph($"{totalLine:C}")).SetTextAlignment(TextAlignment.CENTER)); // Total de la ligne (Quantité x Prix unitaire)
                totalPrice += totalLine;
            }

            // Ajout d'une cellule pour le total général
            table.AddCell(new Cell(1, 3).Add(new Paragraph("TOTAL").SetBold().SetTextAlignment(TextAlignment.CENTER)));
            table.AddCell(new Cell().Add(new Paragraph($"{totalPrice:C}").SetBold().SetTextAlignment(TextAlignment.CENTER)));

            table.SetHorizontalAlignment(HorizontalAlignment.CENTER);
            document.Add(table);

            // Ajout du message de remerciement
            document.Add(new Paragraph("\n\nNOUS VOUS REMERCIONS DE VOTRE CONFIANCE.").SetTextAlignment(TextAlignment.CENTER));

            document.Close();
        }

        return filePath;
    }

    private async Task<bool> SendEmailWithSendGrid(string recipientEmail, string pdfPath)
    {
        var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
        if (string.IsNullOrEmpty(apiKey))
        {
            throw new InvalidOperationException("SendGrid API key is not configured.");
        }

        var client = new SendGridClient(apiKey);
        var from = new EmailAddress("malimaisonelectronic@gmail.com", "Mali Maison Electronique");
        var subject = "Votre devis gratuit";
        var to = new EmailAddress(recipientEmail);
        var plainTextContent = "Veuillez trouver ci-joint votre devis";
        var htmlContent = "<strong>Veuillez trouver ci-joint votre devis</strong>";
        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);

        using (var fileStream = new FileStream(pdfPath, FileMode.Open, FileAccess.Read))
        {
            var bytes = new byte[fileStream.Length];
            await fileStream.ReadAsync(bytes, 0, (int)fileStream.Length);
            msg.AddAttachment("Quote.pdf", Convert.ToBase64String(bytes), "application/pdf");
        }

        var response = await client.SendEmailAsync(msg);
        var responseBody = await response.Body.ReadAsStringAsync();

        // Affichez les détails de la réponse dans la console
        Console.WriteLine($"Response Status Code: {response.StatusCode}");
        Console.WriteLine($"Response Body: {responseBody}");

        return response.StatusCode == System.Net.HttpStatusCode.OK ||
               response.StatusCode == System.Net.HttpStatusCode.Accepted;
    }
}
