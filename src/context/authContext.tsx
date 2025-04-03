"use client";

import { createContext, useReducer, useContext, ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AuthState {
  user: null | {
    email: string;
    agencyName?: string;
    givenName?: string;
    picture?: string;
    groups: string[];
  };
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
};

type AuthAction =
  | {
      type: "LOGIN";
      payload: {
        email: string;
        agencyName?: string;
        givenName?: string;
        picture?: string;
        token: string;
        groups: string[];
      };
    }
  | { type: "LOGOUT" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      const userData = {
        email: action.payload.email,
        agencyName: action.payload.agencyName || "",
        givenName: action.payload.givenName || "",
        picture: action.payload.picture || "",
        groups: action.payload.groups || [],
      };

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(userData));

      return {
        ...state,
        user: userData,
        isAuthenticated: true,
        token: action.payload.token,
      };

    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        user: null,
        isAuthenticated: false,
        token: null,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<
  { state: AuthState; dispatch: React.Dispatch<AuthAction> } | undefined
>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const protectedRoutes = ["/profile", "/admin", "/my-trips"];

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);

        const tokenExpiration = localStorage.getItem("tokenExpiration");
        if (tokenExpiration && new Date().getTime() > parseInt(tokenExpiration)) {
          dispatch({ type: "LOGOUT" });
          if (protectedRoutes.some((route) => pathname.startsWith(route))) {
            router.push("/auth/login");
          }
        } else {
          dispatch({
            type: "LOGIN",
            payload: {
              email: user.email,
              agencyName: user.agencyName,
              givenName: user.givenName,
              picture: user.picture,
              groups: user.groups || [],
              token: storedToken,
            },
          });
        }
      } catch (error) {
        console.error("Erreur de parsing JSON", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, [pathname]);

  if (loading) return null;

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
