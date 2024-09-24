using MaliMaisonApi.Data;
using MaliMaisonApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MaliMaisonApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ProductController : ControllerBase {
    private readonly ApplicationDbContext _product;

    private readonly IWebHostEnvironment _env;

    // Mise en place du Constructeur
    public ProductController(ApplicationDbContext product, IWebHostEnvironment env) {
        _product = product;
        _env = env;
    }

    //GET de tous les produits
    [HttpGet]
    public IEnumerable<Camera> GetAllProducts() {
        return _product.Cameras.ToList();
    }

    //GET d'un produit à travers l'id
    [HttpGet("{id}")]
    public IActionResult GetById(int id ) {
        var product = _product.Cameras.Find(id);

        if(product == null)     return NotFound();

        return Ok(product);
    }

    //Ajouter un produit
[Authorize]
[HttpPost]
public async Task<IActionResult> Add([FromForm] Camera cameraDto, [FromForm] IFormFile file)
{
    if (cameraDto == null || file == null)
        return BadRequest("invalid input");

    // Traitement du fichier
    var imagePath = "/remote/path/Server/MaliMaisonApi/wwwroot/images";

    if (!Directory.Exists(imagePath)) {
        Directory.CreateDirectory(imagePath);
    }

    var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
    var filePath = Path.Combine(imagePath, uniqueFileName);

    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }

    // Création et ajout de l'objet Camera
    var camera = new Camera
    {
        Name = cameraDto.Name,
        Model = cameraDto.Model,
        Price = cameraDto.Price,
        Stock = cameraDto.Stock,
        ImageUrl = $"/images/{uniqueFileName}"
    };

    _product.Cameras.Add(camera);
    await _product.SaveChangesAsync();

    return CreatedAtAction(nameof(GetById), new { id = camera.Id }, camera);
}



//Modifier un produit
[Authorize]
[HttpPut("{id}")]
public IActionResult Update([FromBody] Camera updateProduct, int id) {
    var product = _product.Cameras.Find(id);

    if(product == null)     return NotFound();

    product.Name = updateProduct.Name;
    product.Model = updateProduct.Model;
    product.Price = updateProduct.Price;
    product.Stock = updateProduct.Stock;

    _product.Cameras.Update(product);
    _product.SaveChanges();

    return NoContent();
}

[Authorize]
[HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id) 
{
    // Étape 1 : Vérifie si le produit existe
    var product = await _product.Cameras.FindAsync(id);
    if (product == null) 
        return NotFound();

    // Étape 2 : Supprimer les entrées associées dans QuoteRequestCamera
    var quoteRequestCameras = await _product.Requests
        .SelectMany(q => q.Products)
        .Where(qr => qr.ProductId == id)
        .ToListAsync();

    _product.RemoveRange(quoteRequestCameras);

    // Étape 3 : Supprimer le produit
    _product.Cameras.Remove(product);
    
    // Étape 4 : Enregistrer les changements
    await _product.SaveChangesAsync();

    return NoContent();
}


    private bool ProductExists(int id) {
        return _product.Cameras.Any(e => e.Id == id);
    }
}