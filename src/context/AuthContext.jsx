import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setSeekerInfo, logout as reduxLogout } from "@/redux/slices/userSlice";
import { authService } from "@/services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const applyAuth = useCallback(
    (nextToken, nextUser) => {
      if (nextToken) {
        localStorage.setItem("token", nextToken);
      } else {
        localStorage.removeItem("token");
      }

      setToken(nextToken || null);
      setUser(nextUser || null);
      dispatch(setSeekerInfo(nextUser || {}));
    },
    [dispatch]
  );

  const restore = useCallback(async () => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      applyAuth(null, null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const meRes = await authService.me();
      applyAuth(stored, meRes.user);
    } catch (e) {
      applyAuth(null, null);
    } finally {
      setLoading(false);
    }
  }, [applyAuth]);

  useEffect(() => {
    restore();
  }, [restore]);

  const login = useCallback(
    async (email, password) => {
      const { token: jwtToken, user: nextUser } = await authService.login(email, password);
      applyAuth(jwtToken, nextUser);
      return nextUser;
    },
    [applyAuth]
  );

  const register = useCallback(
    async (name, email, password) => {
      const { token: jwtToken, user: nextUser } = await authService.register(
        name,
        email,
        password
      );
      applyAuth(jwtToken, nextUser);
      return nextUser;
    },
    [applyAuth]
  );

  const loginWithGoogle = useCallback(() => {
    authService.loginWithGoogleRedirect();
  }, []);

  const logout = useCallback(() => {
    applyAuth(null, null);
    dispatch(reduxLogout());
  }, [applyAuth, dispatch]);

  const setPassword = useCallback(
    async (password, confirmPassword) => {
      const { user: nextUser } = await authService.setPassword(password, confirmPassword);
      applyAuth(token, nextUser);
      return nextUser;
    },
    [applyAuth, token]
  );

  const changePassword = useCallback(
    async (currentPassword, newPassword) => {
      const { user: nextUser } = await authService.changePassword(currentPassword, newPassword);
      applyAuth(token, nextUser);
      return nextUser;
    },
    [applyAuth, token]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      loginWithGoogle,
      logout,
      setPassword,
      changePassword,
      restore,
      setToken: (t) => setToken(t),
      setUser: (u) => setUser(u),
      applyAuth,
    }),
    [
      user,
      token,
      loading,
      login,
      register,
      loginWithGoogle,
      logout,
      setPassword,
      changePassword,
      restore,
      applyAuth,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

