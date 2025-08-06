import FusePageCarded from "@fuse/core/FusePageCarded";
import ComplaintsHeader from "./ComplaintsHeader";
import ComplaintsTable from "./ComplaintsTable";
import { useThemeMediaQuery } from "@fuse/hooks";

function Complaints() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageCarded
      header={<ComplaintsHeader />}
      content={<ComplaintsTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default Complaints;