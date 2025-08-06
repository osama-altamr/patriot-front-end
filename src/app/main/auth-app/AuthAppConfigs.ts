import RegisterProfileConfig from "./register-profile/RegisterProfileConfig";
import SignInConfig from "./sign-in/SignInConfig";
import MagicLinkConfig from "./magic-link/MagicLinkConfig";
import ForgotPasswordConfig from "./forgot-password/ForgotPasswordConfig";
import SignOutConfig from "./sign-out/SignOutConfig";
import DeleteAccountConfig from "./delete-account/DeleteAccountConfig";
import SignUpConfig from "./sign-up/SignUpConfig";

const AuthAppConfigs = [
  SignInConfig,
  SignUpConfig,
  MagicLinkConfig,
  ForgotPasswordConfig,
  RegisterProfileConfig,
  SignOutConfig,
  DeleteAccountConfig,
];

export default AuthAppConfigs;
