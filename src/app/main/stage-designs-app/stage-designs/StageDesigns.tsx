import FusePageCarded from "@fuse/core/FusePageCarded";
import StageDesignsHeader from "./StageDesignsHeader";
import StageDesignsTable from "./StageDesignsTable";
import { useThemeMediaQuery } from "@fuse/hooks";

function StageDesigns() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageCarded
      header={<StageDesignsHeader />}
      content={<StageDesignsTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default StageDesigns;