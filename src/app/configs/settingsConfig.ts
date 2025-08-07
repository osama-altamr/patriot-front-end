import themesConfig from "app/configs/themesConfig";
import { FuseSettingsConfigType } from "@fuse/core/FuseSettings/FuseSettings";

import i18n from "../../i18n";
import i18next from "i18next";
import ar from "src/app/main/utils/public-i18n/ar";
import en from "src/app/main/utils/public-i18n/en";
import { authRoles } from "../auth";
i18next.addResourceBundle("en", "public", en);
i18next.addResourceBundle("ar", "public", ar);

/**
 * The settingsConfig object is a configuration object for the Fuse application's settings.
 */
const settingsConfig: FuseSettingsConfigType = {
  /**
   * The layout object defines the layout style and configuration for the application.
   */
  layout: {
    /**
     * The style property defines the layout style for the application.
     */
    style: "layout1", // layout1 layout2 layout3
    /**
     * The config property defines the layout configuration for the application.
     * Check out default layout configs at app/theme-layouts for example app/theme-layouts/layout1/Layout1Config.js
     */
    config: {}, // checkout default layout configs at app/theme-layouts for example  app/theme-layouts/layout1/Layout1Config.js
  },

  /**
   * The customScrollbars property defines whether or not to use custom scrollbars in the application.
   */
  customScrollbars: false,

  /**
   * The direction property defines the text direction for the application.
   */
  direction: i18n.dir(i18n.options.lng) || "ltr", // rtl, ltr
  /**
   * The theme object defines the color theme for the application.
   */
  theme: {
    main: themesConfig.legacy,
    navbar: themesConfig.navbarLegacy,
    toolbar: themesConfig.legacy,
    footer: themesConfig.legacy,
  },

  /**
   * The defaultAuth property defines the default authorization roles for the application.
   * To make the whole app auth protected by default set defaultAuth:['admin','staff','user']
   * To make the whole app accessible without authorization by default set defaultAuth: null
   * The individual route configs which have auth option won't be overridden.
   */
  defaultAuth: authRoles.user,

  /**
   * The loginRedirectUrl property defines the default redirect URL for the logged-in user.
   */
  loginRedirectUrl: "/",
};

export default settingsConfig;
