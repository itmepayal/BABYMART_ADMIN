// Users params
export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

// Avatar
export interface Avatar {
  public_id: string;
  url: string;
}

// Address
export interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
}

// User
export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "user" | "admin" | "deliveryMan";
  avatar: Avatar;
  wishlist: any[];
  cart: any[];
  addresses: Address[];
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}
