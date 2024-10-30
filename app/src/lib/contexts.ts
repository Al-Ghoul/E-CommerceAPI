import { createContext } from "react";

export const AuthContext = createContext<UserData>({
  isAuthenticated: false,
  userId: undefined,
});
