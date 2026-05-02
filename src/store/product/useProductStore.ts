import { create } from "zustand";
import { productService } from "@/services/ProductService";

// ================= TYPES =================
type ProductImage = {
  url: string;
  public_id: string;
};

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: any;
  brand: any;
  images: ProductImage[];
  discountPercentage: number;
  stock: number;
  averageRating: number;
  isDeleted?: boolean;
};

// ================= QUERY PARAMS =================
type ProductQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
};

// ================= STATE =================
type ProductState = {
  products: Product[];
  selectedProduct: Product | null;

  loading: boolean;
  isFetchingProducts: boolean;
  error: string | null;

  total: number;
  page: number;
  pages: number;

  // ================= ACTIONS =================
  getAllProducts: (params?: ProductQuery) => Promise<void>;
  getProductById: (id: string) => Promise<any>;
  createProduct: (payload: any) => Promise<void>;
  updateProduct: (id: string, payload: any) => Promise<void>;

  deleteProduct: (id: string) => Promise<void>;

  bulkDeleteProducts: (ids: string[]) => Promise<void>;
  bulkRestoreProducts: (ids: string[]) => Promise<void>;
  bulkPermanentDeleteProducts: (ids: string[]) => Promise<void>;

  setProducts: (products: Product[]) => void;
};

// ================= STORE =================
export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,

  loading: false,
  isFetchingProducts: false,
  error: null,

  total: 0,
  page: 1,
  pages: 1,

  // ================= GET ALL =================
  getAllProducts: async (params = {}) => {
    try {
      set({ loading: true, isFetchingProducts: true });

      const res = await productService.getAllProducts(params);

      set({
        products: res.products,
        total: res.total,
        page: res.page,
        pages: res.pages,
        loading: false,
        isFetchingProducts: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        isFetchingProducts: false,
        error: err?.response?.data?.message || "Failed to fetch products",
      });
    }
  },

  // ================= GET BY ID =================
  getProductById: async (id) => {
    try {
      set({ loading: true });

      const res = await productService.getProductById(id);
      set({
        selectedProduct: res.data,
        loading: false,
      });
      return res;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to fetch product",
      });
    }
  },

  // ================= CREATE =================
  createProduct: async (payload) => {
    try {
      set({ loading: true });

      await productService.createProduct(payload);

      await get().getAllProducts();

      set({ loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Create product failed",
      });
      throw err;
    }
  },

  // ================= UPDATE =================
  updateProduct: async (id, payload) => {
    try {
      set({ loading: true });

      await productService.updateProduct(id, payload);

      await get().getAllProducts();

      set({ loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Update product failed",
      });
      throw err;
    }
  },

  // ================= SINGLE DELETE =================
  deleteProduct: async (id) => {
    const prev = get().products;

    set({
      products: prev.filter((p) => p._id !== id),
    });

    try {
      await productService.deleteProduct(id);
      await get().getAllProducts();
    } catch (err: any) {
      set({
        products: prev,
        error: err?.response?.data?.message || "Delete product failed",
      });
    }
  },

  // ================= BULK DELETE =================
  bulkDeleteProducts: async (ids) => {
    const prev = get().products;

    set({
      products: prev.filter((p) => !ids.includes(p._id)),
    });

    try {
      await productService.bulkDeleteProducts(ids);
      await get().getAllProducts();
    } catch (err: any) {
      set({
        products: prev,
        error: err?.response?.data?.message || "Bulk delete failed",
      });
    }
  },

  // ================= BULK RESTORE =================
  bulkRestoreProducts: async (ids) => {
    try {
      await productService.bulkRestoreProducts(ids);
      await get().getAllProducts();
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Restore failed",
      });
    }
  },

  // ================= BULK PERMANENT DELETE =================
  bulkPermanentDeleteProducts: async (ids) => {
    const prev = get().products;

    set({
      products: prev.filter((p) => !ids.includes(p._id)),
    });

    try {
      await productService.bulkPermanentDeleteProducts(ids);
      await get().getAllProducts();
    } catch (err: any) {
      set({
        products: prev,
        error: err?.response?.data?.message || "Permanent delete failed",
      });
    }
  },

  // ================= SET =================
  setProducts: (products) => set({ products }),
}));
