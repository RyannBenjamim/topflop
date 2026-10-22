import { getStoredToken } from "./getStoredToken";

export const isAuthenticated = (): boolean => {
  return getStoredToken() !== null;
}
