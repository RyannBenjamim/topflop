import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/auth";

export const getStoredToken = (): { token: string, payload: JwtPayload } | null => {
  try {
    const stored = localStorage.getItem('user_access_data');
    if (!stored) return null;

    const { token } = JSON.parse(stored);
    if (!token) return null;

    const payload = jwtDecode<JwtPayload>(token);
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem('user_access_data');
      return null;
    }

    return { token, payload };
  } catch {
    localStorage.removeItem('user_access_data');
    return null;
  }
}
