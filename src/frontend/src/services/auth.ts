import { backend } from "../../../declarations/backend";

export interface AuthUser {
  username: string;
  isAuthenticated: boolean;
}

const AUTH_KEY = "auth_user";

export const authService = {
  async signup(username: string, password: string): Promise<string> {
    try {
      const response = await backend.signup(username, password);
      if ("Ok" in response) {
        // Store auth state
        const user: AuthUser = { username, isAuthenticated: true };
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        return response.Ok;
      }
      throw new Error("Err" in response ? response.Err : "Signup failed");
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  },

  async signin(username: string, password: string): Promise<string> {
    try {
      const response = await backend.signin(username, password);
      if ("Ok" in response) {
        // Store auth state
        const user: AuthUser = { username, isAuthenticated: true };
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        return response.Ok;
      }
      throw new Error("Err" in response ? response.Err : "Sign in failed");
    } catch (error) {
      console.error("Signin failed:", error);
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
    window.location.reload(); // Refresh to reset app state
  },

  getCurrentUser(): AuthUser | null {
    const userJson = localStorage.getItem(AUTH_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  },
};
