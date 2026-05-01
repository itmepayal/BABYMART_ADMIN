import { create } from "zustand";
import { categoryService, type Category } from "@/services/CategoriesService";

// ================= STATE TYPE =================
type CategoryState = {
  categories: Category[];
  selectedCategory: Category | null;

  loading: boolean;
  isFetchingCategories: boolean;
  error: string | null;

  total: number;
  page: number;
  pages: number;

  // ================= ACTIONS =================
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

// ================= STORE =================
export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  selectedCategory: null,

  loading: false,
  isFetchingCategories: false,
  error: null,

  total: 0,
  page: 1,
  pages: 1,

  // ================= GET ALL =================
  getAllCategories: async (params = {}) => {
    try {
      set({ loading: true, isFetchingCategories: true });

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

  // ================= GET BY ID =================
  getCategoryById: async (id) => {
    try {
      set({ loading: true });

      const res = await categoryService.getCategoryById(id);

      set({
        selectedCategory: res.data,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to fetch category",
      });
    }
  },

  // ================= CREATE =================
  createCategory: async (payload) => {
    try {
      set({ loading: true });

      await categoryService.createCategory(payload);

      await get().getAllCategories();

      set({ loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Create failed",
      });
      throw err;
    }
  },

  // ================= UPDATE =================
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

  // ================= SINGLE DELETE =================
  deleteCategory: async (id) => {
    const prev = get().categories;

    // optimistic UI
    set({
      categories: prev.filter((c) => c._id !== id),
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

  // ================= BULK DELETE =================
  bulkDeleteCategories: async (ids) => {
    const prev = get().categories;

    set({
      categories: prev.filter((c) => !ids.includes(c._id)),
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

  // ================= BULK RESTORE =================
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

  // ================= BULK PERMANENT DELETE =================
  bulkPermanentDeleteCategories: async (ids) => {
    const prev = get().categories;

    set({
      categories: prev.filter((c) => !ids.includes(c._id)),
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

  // ================= SET =================
  setCategories: (categories) => set({ categories }),
}));
