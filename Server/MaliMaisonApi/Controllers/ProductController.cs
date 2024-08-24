using MaliMaisonApi.Data;
using MaliMaisonApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaliMaisonApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ProductController : ControllerBase {
    private readonly CameraDbContext _product;

    // Mise en place du Constructeur
    public ProductController(CameraDbContext product) {
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
    [Authorize]
    [HttpPost]
    public IActionResult Add([FromBody] Camera product) {
        if(product == null)      return BadRequest();

        _product.Cameras.Add(product);
        _product.SaveChanges();

        return CreatedAtAction(nameof(GetById), new{ id = product.Id}, product);
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

    //Supprimmer un produit
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id) {
        var product = _product.Cameras.Find(id);

        if(product == null)     return NotFound();

        _product.Cameras.Remove(product);
        _product.SaveChanges();

        return NoContent();
    }
}