namespace OKVIP.Models
{
    public class Product
    {
        public string Id { get; set; }

        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string Price { get; set; }
        public string UserId { get; set; }
    }

    public class ProductList
    {
        public List<Product> Products{ get; set; }

    }
    public class CreateProductReq
    {
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string Price { get; set; }
        public string UserId { get; set; }
    }
}
