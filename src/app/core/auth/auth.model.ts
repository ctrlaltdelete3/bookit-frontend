export interface AuthResponse {
  token: string;
  expiresAt: string;
  userId: number;
  email: string;
  firstName: string;
  isTenantOwner: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  isTenantOwner: boolean;
  ownedTenantId: number | null;
}
