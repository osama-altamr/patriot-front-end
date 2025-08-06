import FusePageCarded from "@fuse/core/FusePageCarded";
import CitiesHeader from "./CitiesHeader";
import CitiesTable from "./CitiesTable";
import { useThemeMediaQuery } from "@fuse/hooks";

function Cities() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageCarded
      header={<CitiesHeader />}
      content={<CitiesTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default Cities;