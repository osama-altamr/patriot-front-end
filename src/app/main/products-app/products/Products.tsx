import FusePageCarded from "@fuse/core/FusePageCarded";
import ProductsHeader from "./ProductsHeader";
import ProductsTable from "./ProductsTable";
import { useThemeMediaQuery } from "@fuse/hooks";

function Products() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageCarded
      header={<ProductsHeader />}
      content={<ProductsTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default Products;