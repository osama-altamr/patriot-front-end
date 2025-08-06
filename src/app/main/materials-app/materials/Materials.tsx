import FusePageCarded from "@fuse/core/FusePageCarded";
import MaterialsHeader from "./MaterialsHeader";
import MaterialsTable from "./MaterialsTable";
import { useThemeMediaQuery } from "@fuse/hooks";

function Materials() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageCarded
      header={<MaterialsHeader />}
      content={<MaterialsTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default Materials;