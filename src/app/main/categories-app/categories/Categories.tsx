import FusePageCarded from "@fuse/core/FusePageCarded";
import CategoriesHeader from "./CategoriesHeader";
import CategoriesTable from "./CategoriesTable";
import { useThemeMediaQuery } from "@fuse/hooks";

function Categories() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageCarded
      header={<CategoriesHeader />}
      content={<CategoriesTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default Categories;