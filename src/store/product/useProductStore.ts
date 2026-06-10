import { create } from "zustand";
import { productService } from "@/services/ProductService";
import type { Product, GetAllProductsParams } from "@/types/product";

// =========================================
// STATE
// =========================================
type ProductState = {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  isFetchingProducts: boolean;
  error: string | null;
  total: number;
  page: number;
  pages: number;

  // =====================================
  // ACTIONS
  // =====================================
  getAllProducts: (params?: GetAllProductsParams) => Promise<void>;
  getProductById: (id: string) => Promise<Product | null>;

  createProduct: (formData: FormData) => Promise<void>;
  updateProduct: (id: string, formData: FormData) => Promise<void>;

  deleteProduct: (id: string) => Promise<void>;
  bulkDeleteProducts: (ids: string[]) => Promise<void>;
  bulkRestoreProducts: (ids: string[]) => Promise<void>;
  bulkPermanentDeleteProducts: (ids: string[]) => Promise<void>;

  setProducts: (products: Product[]) => void;
  clearSelectedProduct: () => void;
  clearError: () => void;
};

// =========================================
// STORE
// =========================================
export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,

  loading: false,
  isFetchingProducts: false,
  error: null,

  total: 0,
  page: 1,
  pages: 1,

  // =====================================
  // GET ALL PRODUCTS
  // =====================================
  getAllProducts: async (params = {}) => {
    try {
      set({
        isFetchingProducts: true,
        error: null,
      });

      const res = await productService.getAllProducts(params);

      set({
        products: res.products,
        total: res.total,
        page: res.page,
        pages: res.pages,
        isFetchingProducts: false,
      });
    } catch (error: any) {
      set({
        isFetchingProducts: false,
        error: error?.response?.data?.message || "Failed to fetch products",
      });
    }
  },

  // =====================================
  // GET PRODUCT BY ID
  // =====================================
  getProductById: async (id: string) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await productService.getProductById(id);

      set({
        selectedProduct: res.data,
        loading: false,
      });

      return res.data;
    } catch (error: any) {
      set({
        loading: false,
        error: error?.response?.data?.message || "Failed to fetch product",
      });

      return null;
    }
  },

  // =====================================
  // CREATE PRODUCT
  // =====================================
  createProduct: async (formData: FormData) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await productService.createProduct(formData);

      await get().getAllProducts();

      set({
        loading: false,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error?.response?.data?.message || "Failed to create product",
      });

      throw error;
    }
  },

  // =====================================
  // UPDATE PRODUCT
  // =====================================
  updateProduct: async (id: string, formData: FormData) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await productService.updateProduct(id, formData);

      await get().getAllProducts();

      set({
        loading: false,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error?.response?.data?.message || "Failed to update product",
      });

      throw error;
    }
  },

  // =====================================
  // DELETE PRODUCT
  // =====================================
  deleteProduct: async (id: string) => {
    const previousProducts = get().products;

    set({
      products: previousProducts.filter((product) => product._id !== id),
    });

    try {
      await productService.deleteProduct(id);
      await get().getAllProducts();
    } catch (error: any) {
      set({
        products: previousProducts,
        error: error?.response?.data?.message || "Failed to delete product",
      });

      throw error;
    }
  },

  // =====================================
  // BULK DELETE
  // =====================================
  bulkDeleteProducts: async (ids: string[]) => {
    const previousProducts = get().products;

    set({
      products: previousProducts.filter(
        (product) => !ids.includes(product._id),
      ),
    });

    try {
      await productService.bulkDeleteProducts(ids);
      await get().getAllProducts();
    } catch (error: any) {
      set({
        products: previousProducts,
        error: error?.response?.data?.message || "Failed to delete products",
      });

      throw error;
    }
  },

  // =====================================
  // BULK RESTORE
  // =====================================
  bulkRestoreProducts: async (ids: string[]) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await productService.bulkRestoreProducts(ids);
      await get().getAllProducts();

      set({
        loading: false,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error?.response?.data?.message || "Failed to restore products",
      });

      throw error;
    }
  },

  // =====================================
  // BULK PERMANENT DELETE
  // =====================================
  bulkPermanentDeleteProducts: async (ids: string[]) => {
    const previousProducts = get().products;

    set({
      products: previousProducts.filter(
        (product) => !ids.includes(product._id),
      ),
    });

    try {
      await productService.bulkPermanentDeleteProducts(ids);
      await get().getAllProducts();
    } catch (error: any) {
      set({
        products: previousProducts,
        error:
          error?.response?.data?.message ||
          "Failed to permanently delete products",
      });

      throw error;
    }
  },

  setProducts: (products) => set({ products }),

  clearSelectedProduct: () =>
    set({
      selectedProduct: null,
    }),

  clearError: () =>
    set({
      error: null,
    }),
}));
