export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: null | User;
}

export interface User {
  email: string;
  id: string;
  name: string;
  picture?: string;
}
