using MaliMaisonApi.Data;
using MaliMaisonApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    //[Authorize]
    [HttpPost]
    public async Task<IActionResult> Add([FromForm] CameraDto product) {
        if(product == null)      return BadRequest();

        string? imageUrl = null;

        if(product.Image != null && product.Image.Length > 0) {
            var uploadPath = Path.Combine(_env.WebRootPath, "images");

            if(!Directory.Exists(uploadPath)) {
                Directory.CreateDirectory(uploadPath);
            }

            var fileName = Path.GetFileNameWithoutExtension(product.Image.FileName);
            var extension = Path.GetExtension(product.Image.FileName);
            var uniqueFileName = $"{fileName}_{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadPath, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create)) {
                await product.Image.CopyToAsync(stream);
            }

            imageUrl = $"/images/{uniqueFileName}";
        }

        var camera = new Camera {
            Name = product.Name,
            Model = product.Model,
            Price = product.Price,
            ImageUrl = imageUrl
        };

        _product.Cameras.Add(camera);
        _product.SaveChanges();

        return CreatedAtAction(nameof(GetById), new{ id = camera.Id}, camera);
    }

    //Modifier un produit
    //[Authorize]
    [HttpPut("{id}")]
    public IActionResult Update([FromForm] Camera updateProduct, int id) {
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

    public class CameraDto {
        public string? Name { get; set; }
        public string? Model { get; set; }
        public decimal Price { get; set; }
        public IFormFile? Image { get; set; } // Champ pour gérer l'image uploadée
    }
}