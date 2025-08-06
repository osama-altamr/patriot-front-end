import { lazy } from "react";
import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";

i18next.addResourceBundle("en", "complaintsApp", en);
i18next.addResourceBundle("ar", "complaintsApp", ar);
const Complaints = lazy(() => import("./complaints/Complaints"));
const Complaint = lazy(() => import("./complaint/Complaint"));

const ComplaintsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "complaints",
      element: <Complaints />,
    },
    {
      path: "complaints/:complaintId",
      element: <Complaint />,
    },
  ],
};

export default ComplaintsAppConfig;