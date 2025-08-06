import { FuseRouteConfigType } from "@fuse/utils/FuseUtils";
import i18next from "i18next";
import DeleteAccountPage from "./DeleteAccountPage";
import en from "./i18n/en";
import ar from "./i18n/ar";
i18next.addResourceBundle("en", "deleteAccount", en);
i18next.addResourceBundle("ar", "deleteAccount", ar);

const DeleteAccountConfig: FuseRouteConfigType = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: null,
  routes: [
    {
      path: "delete-account",
      element: <DeleteAccountPage />,
    },
  ],
};

export default DeleteAccountConfig;
