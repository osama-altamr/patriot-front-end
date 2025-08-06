import FusePageCarded from "@fuse/core/FusePageCarded";
import StatesHeader from "./StatesHeader";
import StatesTable from "./StatesTable";
import { useThemeMediaQuery } from "@fuse/hooks";

function States() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageCarded
      header={<StatesHeader />}
      content={<StatesTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default States;