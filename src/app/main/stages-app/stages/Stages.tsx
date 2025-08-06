import FusePageCarded from "@fuse/core/FusePageCarded";
import StagesHeader from "./StagesHeader";
import StagesTable from "./StagesTable";
import { useThemeMediaQuery } from "@fuse/hooks";

function Stages() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageCarded
      header={<StagesHeader />}
      content={<StagesTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default Stages;