import type { Product } from "@/backend";
import { ExternalBlob } from "@/backend";

export interface SampleProduct extends Omit<Product, "image"> {
  image: ExternalBlob;
}

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Obsidian Cashmere Coat",
    price: 1290,
    description:
      "A masterpiece of minimal tailoring. This oversize cashmere coat in deep obsidian black defines the season with its clean, architectural silhouette and hand-stitched seams.",
    category: "womenswear",
    variants: ["XS", "S", "M", "L", "XL"],
    featured: true,
    createdAt: BigInt(0),
    image: ExternalBlob.fromURL(
      "/assets/generated/product-womens-coat.dim_800x1000.jpg",
    ),
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: "p2",
    name: "Tailored Smoke Blazer",
    price: 890,
    description:
      "Refined charcoal suiting reconstructed for the modern wardrobe. The structured shoulder and fluid drape balance authority with ease.",
    category: "menswear",
    variants: ["36", "38", "40", "42", "44"],
    featured: true,
    createdAt: BigInt(0),
    image: ExternalBlob.fromURL(
      "/assets/generated/product-mens-blazer.dim_800x1000.jpg",
    ),
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: "p3",
    name: "Ivory Silk Slip Dress",
    price: 640,
    description:
      "Poured in 19mm silk charmeuse, this slip dress moves with an effortless grace. The adjustable spaghetti straps and bias cut ensure a perfect, intimate drape.",
    category: "womenswear",
    variants: ["XS", "S", "M", "L"],
    featured: true,
    createdAt: BigInt(0),
    image: ExternalBlob.fromURL(
      "/assets/generated/product-silk-dress.dim_800x1000.jpg",
    ),
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    id: "p4",
    name: "Caramel Leather Tote",
    price: 780,
    description:
      "Shaped from full-grain vegetable-tanned leather, this structured tote ages beautifully. Interior architecture keeps every essential exactly where it belongs.",
    category: "accessories",
    variants: ["One Size"],
    featured: false,
    createdAt: BigInt(0),
    image: ExternalBlob.fromURL(
      "/assets/generated/product-leather-bag.dim_800x1000.jpg",
    ),
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  },
  {
    id: "p5",
    name: "Cloud Linen Shirt",
    price: 320,
    description:
      "Woven from garment-washed Belgian linen, this relaxed-fit shirt carries the effortless texture of something worn and loved. Available in frost white.",
    category: "menswear",
    variants: ["XS", "S", "M", "L", "XL", "XXL"],
    featured: false,
    createdAt: BigInt(0),
    image: ExternalBlob.fromURL(
      "/assets/generated/product-mens-shirt.dim_800x1000.jpg",
    ),
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "p6",
    name: "Arc Silver Jewelry Set",
    price: 460,
    description:
      "Sculptural fine jewelry in recycled sterling silver. The arc-form necklace and drop earrings are designed to be worn together or separately as quiet signatures.",
    category: "accessories",
    variants: ["One Size"],
    featured: false,
    createdAt: BigInt(0),
    image: ExternalBlob.fromURL(
      "/assets/generated/product-jewelry.dim_800x1000.jpg",
    ),
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
];
