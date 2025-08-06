import FuseLayout from "@fuse/core/FuseLayout";
import FuseTheme from "@fuse/core/FuseTheme";
import { SnackbarProvider } from "notistack";
import axios from "axios";
import rtlPlugin from "stylis-plugin-rtl";
import createCache, { Options } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { selectCurrentLanguageDirection } from "app/store/i18nSlice";
import themeLayouts from "app/theme-layouts/themeLayouts";
import { selectMainTheme } from "@fuse/core/FuseSettings/fuseSettingsSlice";
import MockAdapterProvider from "@mock-api/MockAdapterProvider";
import { useAppSelector } from "app/store/hooks";
import { useSelector } from "react-redux";
import withAppProviders from "./withAppProviders";
import AuthenticationProvider from "./auth/AuthenticationProvider";
import AppConfigProvider from "./AppConfigProvider";
import { LicenseInfo } from "@mui/x-license";
import { LocaleString } from "./main/utils/commonTypes";

/**
 * Axios HTTP Request defaults
 */
axios.defaults.baseURL = `${
  import.meta.env.VITE_BASE_URL ?? "https://api.dev.passcpe.com"
}`;
LicenseInfo.setLicenseKey(import.meta.env.VITE_X_MUI_LICENSE_KEY);
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const emotionCacheOptions = {
  rtl: {
    key: "muirtl",
    stylisPlugins: [rtlPlugin],
    insertionPoint: document.getElementById("emotion-insertion-point"),
  },
  ltr: {
    key: "muiltr",
    stylisPlugins: [],
    insertionPoint: document.getElementById("emotion-insertion-point"),
  },
};

/**
 * The main App component.
 */
function App() {
  /**
   * The language direction from the Redux store.
   */
  const langDirection = useAppSelector(selectCurrentLanguageDirection);

  /**
   * The main theme from the Redux store.
   */
  const mainTheme = useSelector(selectMainTheme);
  const html = document.getElementsByTagName("html")[0];
  html.style.fontSize = `${0.95 * 62.5}%`;
  return (
    <MockAdapterProvider>
      <CacheProvider
        value={createCache(emotionCacheOptions[langDirection] as Options)}
      >
        <FuseTheme theme={mainTheme} direction={langDirection}>
          <AppConfigProvider>
            <AuthenticationProvider>
              <SnackbarProvider
                maxSnack={5}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                classes={{
                  containerRoot:
                    "bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99",
                }}
              >
                <FuseLayout layouts={themeLayouts} />
              </SnackbarProvider>
            </AuthenticationProvider>
          </AppConfigProvider>
        </FuseTheme>
      </CacheProvider>
    </MockAdapterProvider>
  );
}

export default withAppProviders(App);

interface SubscriptionProduct {
  id: string;
  name: LocaleString;
  description: LocaleString;
  serviceName: string;
  priceTerm: "byUser" | "sharingProfits" | "none";
  hasSubscriptionFees: boolean;
}

interface SubscriptionProductFeature {
  id: string;
  productId: string; // ObjectId<SubscriptionProduct>
  title: LocaleString;
  description: LocaleString;
  featureName: "products" | ""; // will be static as enum
  keys: string[]; // will be static as enum (Ex: ["maxProductsCount"])
}

interface SubscriptionPlan {
  id: string;
  name: LocaleString;
  description: LocaleString;
  products: {
    productId: string; // ObjectId<SubscriptionProduct>
    //! when priceTerm='byUser'
    minUsers: number;
    maxUsers: number;
    usersFees: number;
    //! when priceTerm='sharingProfits'
    cognitSharingProfits: number; // percentage
    //! when hasSubscriptionFees=true
    feesType: "oneTime" | "monthly" | "yearly";
    fees: number;
    //! common
    insurance: number;
    // TODO
    features: {
      featureId: string; // ObjectId<SubscriptionProductFeature>
      configs: {
        key: string; // Ex: "maxProductsCount"
        value: any; // Ex: 50
      }[];
    }[]; // Ex: [{maxProductsCount: 50, title: "Max Products Count"}]
  }[];
}
