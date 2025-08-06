import FusePageCarded from "@fuse/core/FusePageCarded";
import ReportsHeader from "./ReportsHeader";
import ReportsTable from "./ReportsTable";
import { useThemeMediaQuery } from "@fuse/hooks";

function Reports() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageCarded
      header={<ReportsHeader />}
      content={<ReportsTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default Reports;