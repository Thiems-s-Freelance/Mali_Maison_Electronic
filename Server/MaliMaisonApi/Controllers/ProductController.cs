using MaliMaisonApi.Data;
using MaliMaisonApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaliMaisonApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ProductController : ControllerBase {
    private readonly ApplicationDbContext _product;

    // Mise en place du Constructeur
    public ProductController(ApplicationDbContext product) {
        _product = product;
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
    //[Authorize]
[HttpPost]
public async Task<IActionResult> Add([FromForm] Camera cameraDto, [FromForm] IFormFile file)
{
    if (cameraDto == null || file == null)
        return BadRequest("invalid input");

    // Traitement du fichier
    var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

    if (!Directory.Exists(imagePath)) {
        Directory.CreateDirectory(imagePath);
    }

    var filePath = Path.Combine(imagePath, file.FileName);

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
        ImageUrl = $"/images/{file.FileName}"
    };

    _product.Cameras.Add(camera);
    await _product.SaveChangesAsync();

    return CreatedAtAction(nameof(GetById), new { id = camera.Id }, camera);
}



    //Modifier un produit
    //[Authorize]
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

    //Supprimmer un produit
    //[Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id) {
        var product = _product.Cameras.Find(id);

        if(product == null)     return NotFound();

        _product.Cameras.Remove(product);
        _product.SaveChanges();

        return NoContent();
    }

    private bool ProductExists(int id) {
        return _product.Cameras.Any(e => e.Id == id);
    }
}