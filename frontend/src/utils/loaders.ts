import { redirect } from "react-router-dom";
import { isAuthenticated } from "./isAuthenticated";

export const requireAuth = () => {
  if (!isAuthenticated()) return redirect("/login");
  return null;
}

export const requireNoAuth = () => {
  if (isAuthenticated()) return redirect("/");
  return null;
}
