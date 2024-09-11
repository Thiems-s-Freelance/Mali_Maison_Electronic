namespace MaliMaisonApi.Models;

public class QuoteRequest {
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string Name { get; set; }  = null!;
    public string Email { get; set; }  = null!;
    public DateTime RequestTime { get; set; }

    public List<QuoteRequestCamera> Products { get; set; } = new List<QuoteRequestCamera>();
}

public class QuoteRequestCamera {
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public Camera? Camera { get; set; }
}