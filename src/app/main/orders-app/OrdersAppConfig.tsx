import { lazy } from "react";
import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";

i18next.addResourceBundle("en", "ordersApp", en);
i18next.addResourceBundle("ar", "ordersApp", ar);

const Orders = lazy(() => import("./orders/Orders"));
const Order = lazy(() => import("./order/Order"));

const OrdersAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "orders",
      element: <Orders />,
    },
    {
      path: "orders/:orderId",
      element: <Order />,
    },
  ],
};

export default OrdersAppConfig;