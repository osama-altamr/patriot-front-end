import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { PartialDeep } from "type-fest";
import { User } from "../../user";
import config from "./jwtAuthConfig";
import Cookies from "js-cookie";

export type JwtAuthStatus = "configuring" | "authenticated" | "unauthenticated";

export type JwtAuthConfig = {
  signInWithRefreshToken: string;
  accessToken: string;
  signInWithEmailAndPassword: string;
  signUpWithEmailAndPassword: string;
  requestAuthToken: string;
  signInWithEmailAndToken: string;
  requestResetCode: string;
  verifyResetCode: string;
  updateUser: string;
};

export type JwtAuthContextType = {
  user?: User;
  updateMe?: (user: PartialDeep<User>) => Promise<User>;
  signOut?: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsLoading?: (T: boolean) => void;
  authStatus: JwtAuthStatus;
  requestMagicLink?: (email: string) => Promise<any>;
  signInWithEmailAndToken?: (email: string, token: string) => Promise<any>;
  signInWithEmailAndPassword?: (
    email: string,
    password: string
  ) => Promise<any>;
  signUpWithEmailAndPassword?: (
    email: string,
    password: string
  ) => Promise<any>;
  requestResetCode?: (email: string) => Promise<any>;
  verifyResetCode?: (
    email: string,
    password: string,
    resetCode: string
  ) => Promise<any>;
};

const defaultAuthContext: JwtAuthContextType = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  setIsLoading: () => {},
  authStatus: "configuring",
};

export const JwtAuthContext =
  createContext<JwtAuthContextType>(defaultAuthContext);

export type JwtAuthProviderProps = {
  children: React.ReactNode;
};

function JwtAuthProvider(props: JwtAuthProviderProps) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStatus, setAuthStatus] = useState("configuring");

  const { children } = props;

  /**
   * Handle error
   */
  const handleError = useCallback((error) => {
    resetSession();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  // Set session
  const setSession = useCallback(
    (accessToken: string, refreshToken?: string) => {
      if (accessToken) {
        if (refreshToken) {
          Cookies.set("refresh_token", refreshToken);
        }
        Cookies.set("access_token", accessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      }
    },
    []
  );

  // Reset session
  const resetSession = useCallback(() => {
    Cookies.remove("refresh_token");
    Cookies.remove("access_token");
    delete axios.defaults.headers.common.Authorization;
  }, []);

  // Get access token from local storage
  const getAccessToken = useCallback(() => {
    return Cookies.get("access_token");
  }, []);

  // Get refresh token from local storage
  const getRefreshToken = useCallback(() => {
    return Cookies.get("refresh_token");
  }, []);

  // Check if the access token exist and is valid on mount
  useEffect(() => {
    const attemptAutoLogin = async () => {
      const accessToken = getAccessToken();
      if (accessToken) {
        try {
          setIsLoading(true);
          setSession(accessToken);
          await signInWithToken();

          return true;
        } catch (error) {
          handleError(error);
          return false;
        }
      } else {
        resetSession();
        return false;
      }
    };

    if (!isAuthenticated) {
      attemptAutoLogin().then((signedIn) => {
        setIsLoading(false);
        setAuthStatus(signedIn ? "authenticated" : "unauthenticated");
      });
    }
  }, [setSession, handleError, getAccessToken, isAuthenticated]);

  /**
   * Sign out
   */
  const signOut = useCallback(() => {
    resetSession();
    setIsAuthenticated(false);
    setUser(null);
    setAuthStatus("unauthenticated");
  }, []);

  const updateMe = useCallback(async (user: PartialDeep<User>) => {
    const response: AxiosResponse<User> = await axios.patch(config.updateUser, {
      ...user,
    });
    const userData = response?.data;
    setUser(userData);
    return userData;
  }, []);

  const getMe = useCallback(async () => {
    const response: AxiosResponse<User> = await axios.get(config.accessToken);
    const userData = response?.data;
    return userData;
  }, []);

  const signInWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      try {
        const response: AxiosResponse<{
          user: User;
          accessToken: string;
          refreshToken: string;
        }> = await axios.post(config.signInWithEmailAndPassword, {
          email,
          password,
        });
        const data = response?.data;
        setSession(data.accessToken, data.refreshToken);
        setIsAuthenticated(true);
        setUser(data.user);
        setAuthStatus("authenticated");
        return data.user;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    []
  );

  const signUpWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      try {
        const response: AxiosResponse<{
          user: User;
          accessToken: string;
          refreshToken: string;
        }> = await axios.post(config.signUpWithEmailAndPassword, {
          email,
          password,
        });
        const data = response?.data;
        setSession(data.accessToken, data.refreshToken);
        setIsAuthenticated(true);
        setUser(data.user);
        setAuthStatus("authenticated");
        return data.user;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    []
  );

  const requestResetCode = useCallback(async (email: string) => {
    try {
      const response: AxiosResponse = await axios.post(
        config.requestResetCode,
        { email }
      );
      return await response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const verifyResetCode = useCallback(
    async (email: string, password: string, resetCode: string) => {
      try {
        const response: AxiosResponse = await axios.post(
          config.verifyResetCode,
          { email, password, resetCode }
        );
        return await response.data;
      } catch (error) {
        throw error;
      }
    },
    []
  );

  const requestMagicLink = useCallback(async (email: string) => {
    try {
      const response: AxiosResponse = await axios.post(
        config.requestAuthToken,
        { email }
      );
      return await response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const signInWithEmailAndToken = useCallback(
    async (email: string, token: string) => {
      try {
        const response: AxiosResponse<{
          user: User;
          accessToken: string;
          refreshToken: string;
        }> = await axios.post(config.signInWithEmailAndToken, { email, token });
        const data = response?.data;
        setSession(data.accessToken, data.refreshToken);
        setIsAuthenticated(true);
        setUser(data.user);
        setAuthStatus("authenticated");
        return data.user;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    []
  );

  const signInWithToken = useCallback(async () => {
    try {
      const userData = await getMe();
      setIsAuthenticated(true);
      setUser(userData);
      setAuthStatus("authenticated");
      return userData;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, []);

  /**
   * if a successful response contains a new Authorization header,
   * updates the access token from it.
   *
   */
  useEffect(() => {
    if (isAuthenticated) {
      setInterceptors();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      setAuthStatus("authenticated");
    } else {
      setAuthStatus("unauthenticated");
    }
  }, [user]);

  const setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response.status === 401 &&
          originalRequest.url !== "auth-sessions/refresh"
        ) {
          originalRequest._retry = true;

          const refreshToken = getRefreshToken();

          // Request new access token using refresh token
          return axios
            .post(config.signInWithRefreshToken, {
              refreshToken: refreshToken,
            })
            .then((res) => {
              if (res.status === 201) {
                this.setSession(res.data.accessToken);
                return axios(originalRequest, {
                  headers: {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${res.data.accessToken}`,
                  },
                });
              }
            });
        }

        // If refresh token is also expired, redirect to login
        if (
          error.response.status === 401 &&
          originalRequest.url === config.signInWithRefreshToken
        ) {
          // Handle logout and redirect to login page
          signOut();
        }

        return Promise.reject(error);
      }
    );
  };

  const authContextValue = useMemo(
    () =>
      ({
        user,
        isAuthenticated,
        authStatus,
        isLoading,
        signOut,
        updateMe,
        setIsLoading,
        signInWithEmailAndPassword,
        signUpWithEmailAndPassword,
        requestMagicLink,
        signInWithEmailAndToken,
        requestResetCode,
        verifyResetCode,
      }) as JwtAuthContextType,
    [
      user,
      isAuthenticated,
      isLoading,
      signOut,
      updateMe,
      setIsLoading,
      signInWithEmailAndPassword,
      signUpWithEmailAndPassword,
      requestMagicLink,
      signInWithEmailAndToken,
      requestResetCode,
      verifyResetCode,
    ]
  );

  return (
    <JwtAuthContext.Provider value={authContextValue}>
      {children}
    </JwtAuthContext.Provider>
  );
}

export default JwtAuthProvider;
