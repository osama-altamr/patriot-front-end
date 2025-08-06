import { JwtAuthConfig } from "./JwtAuthProvider";

const jwtAuthConfig: JwtAuthConfig = {
  signInWithRefreshToken: "v1/auth-sessions/refresh",
  signInWithEmailAndPassword: "v1/auth-sessions/email",
  signUpWithEmailAndPassword: "v1/users",
  requestAuthToken: "v1/auth/tokens",
  signInWithEmailAndToken: "v1/sessions/email",
  requestResetCode: "v1/users/forgot-password",
  verifyResetCode: "v1/users/reset-password",
  accessToken: "v1/users/me",
  updateUser: "v1/users/me",
};

export default jwtAuthConfig;
