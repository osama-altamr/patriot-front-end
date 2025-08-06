import { lazy } from "react";
import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";

i18next.addResourceBundle("en", "employeesApp", en);
i18next.addResourceBundle("ar", "employeesApp", ar);
const Employees = lazy(() => import("./employees/Employees"));
const Employee = lazy(() => import("./employee/Employee"));

const EmployeesAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "employees",
      element: <Employees />,
    },
    {
      path: "employees/:employeeId",
      element: <Employee />,
    },
  ],
};

export default EmployeesAppConfig;