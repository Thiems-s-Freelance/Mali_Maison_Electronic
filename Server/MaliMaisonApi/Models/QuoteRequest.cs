namespace MaliMaisonApi.Models;

public class QuoteRequest {
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public List<Camera> Cameras { get; set; } = new List<Camera>();
    public DateTime RequestTime { get; set; }

    public decimal ToltalPrice => Cameras.Sum(p => p.Price);
}