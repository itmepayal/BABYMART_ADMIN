import { create } from "zustand";
import { categoryService } from "@/services/CategoryService";
import type { Category } from "@/types/category.types";

type CategoryState = {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  isFetchingCategories: boolean;
  error: string | null;
  total: number;
  page: number;
  pages: number;
  getAllCategories: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) => Promise<void>;
  getCategoryById: (id: string) => Promise<void>;
  createCategory: (payload: FormData) => Promise<void>;
  updateCategory: (id: string, payload: FormData) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  bulkDeleteCategories: (ids: string[]) => Promise<void>;
  bulkRestoreCategories: (ids: string[]) => Promise<void>;
  bulkPermanentDeleteCategories: (ids: string[]) => Promise<void>;
  setCategories: (categories: Category[]) => void;
};

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  selectedCategory: null,

  loading: false,
  isFetchingCategories: false,
  error: null,

  total: 0,
  page: 1,
  pages: 1,

  getAllCategories: async (params = {}) => {
    try {
      set({
        loading: true,
        isFetchingCategories: true,
      });

      const res = await categoryService.getAllCategories(params);

      set({
        categories: res.categories,
        total: res.total,
        page: res.page,
        pages: res.pages,
        loading: false,
        isFetchingCategories: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        isFetchingCategories: false,
        error: err?.response?.data?.message || "Failed to fetch categories",
      });
    }
  },

  getCategoryById: async (id) => {
    try {
      set({ loading: true });

      const res = await categoryService.getCategoryById(id);
      console.log("I am response");
      console.log(res);
      set({
        selectedCategory: res,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to fetch category",
      });
    }
  },

  createCategory: async (payload) => {
    try {
      set({ loading: true });

      await categoryService.createCategory(payload);

      await get().getAllCategories();

      set({ loading: false });
    } catch (err: any) {
      console.log(err.response.data);
      set({
        loading: false,
        error: err?.response?.data?.message || "Create failed",
      });
      throw err;
    }
  },

  updateCategory: async (id, payload) => {
    try {
      set({ loading: true });

      await categoryService.updateCategory(id, payload);

      await get().getAllCategories();

      set({ loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Update failed",
      });
      throw err;
    }
  },

  deleteCategory: async (id) => {
    const prev = get().categories;

    set({
      categories: prev.filter((category) => category._id !== id),
    });

    try {
      await categoryService.deleteCategory(id);
      await get().getAllCategories();
    } catch (err: any) {
      set({
        categories: prev,
        error: err?.response?.data?.message || "Delete failed",
      });
    }
  },

  bulkDeleteCategories: async (ids) => {
    const prev = get().categories;

    set({
      categories: prev.filter((category) => !ids.includes(category._id)),
    });

    try {
      await categoryService.bulkDeleteCategories(ids);
      await get().getAllCategories();
    } catch (err: any) {
      set({
        categories: prev,
        error: err?.response?.data?.message || "Bulk delete failed",
      });
    }
  },

  bulkRestoreCategories: async (ids) => {
    try {
      await categoryService.bulkRestoreCategories(ids);
      await get().getAllCategories();
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Restore failed",
      });
    }
  },

  bulkPermanentDeleteCategories: async (ids) => {
    const prev = get().categories;

    set({
      categories: prev.filter((category) => !ids.includes(category._id)),
    });

    try {
      await categoryService.bulkPermanentDeleteCategories(ids);
      await get().getAllCategories();
    } catch (err: any) {
      set({
        categories: prev,
        error: err?.response?.data?.message || "Permanent delete failed",
      });
    }
  },

  setCategories: (categories) => set({ categories }),
}));
