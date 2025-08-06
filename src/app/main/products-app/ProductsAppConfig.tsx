import { lazy } from "react";
import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";

i18next.addResourceBundle("en", "productsApp", en);
i18next.addResourceBundle("ar", "productsApp", ar);
const Products = lazy(() => import("./products/Products"));
const Product = lazy(() => import("./product/Product"));

const ProductsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "products",
      element: <Products />,
    },
    {
      path: "products/:productId",
      element: <Product />,
    },
  ],
};

export default ProductsAppConfig;