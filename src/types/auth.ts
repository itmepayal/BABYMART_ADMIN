// ----------------------
// TYPES
// ----------------------
export type RegisterCredentials = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "user" | "admin" | "deliveryMan";
};

export type AuthUser = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: "admin" | "user" | "deliveryman";
};

export type AuthResponse = {
  data: {
    user: AuthUser;
    accessToken?: string;
  };
};
