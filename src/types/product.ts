export type ProductImage = {
  public_id: string;
  url: string;
};

export type ProductRating = {
  _id?: string;
  userId: string;
  rating: number;
  review?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  brand: string;
  sellerId?: string;
  images: ProductImage[];
  price: number;
  discountPercentage: number;
  finalPrice: number;
  ratings: ProductRating[];
  averageRating: number;
  totalReviews: number;
  soldCount: number;
  tags?: string[];
  isFeatured: boolean;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateProductPayload = {
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  brand: string;
  sellerId?: string;
  price: number;
  discountPercentage?: number;
  tags?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  images: File[];
};

export type UpdateProductPayload = Partial<
  Omit<CreateProductPayload, "images">
> & {
  images?: File[];
};

export type GetAllProductsParams = {
  page?: number;
  limit?: number;

  search?: string;

  category?: string;
  brand?: string;

  minPrice?: number;
  maxPrice?: number;

  minRating?: number;

  isFeatured?: boolean;
  isActive?: boolean;

  sortBy?: "createdAt" | "price" | "averageRating" | "soldCount";

  sortOrder?: "asc" | "desc";
};

export type GetAllProductsResponse = {
  success: boolean;
  message: string;

  products: Product[];

  total: number;
  page: number;
  pages: number;
  limit: number;
};

export type ProductResponse = {
  success: boolean;
  message: string;
  data: Product;
};

export type ApiResponse = {
  success: boolean;
  message: string;
};
