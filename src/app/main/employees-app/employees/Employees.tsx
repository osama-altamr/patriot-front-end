import FusePageCarded from "@fuse/core/FusePageCarded";
import EmployeesHeader from "./EmployeesHeader";
import EmployeesTable from "./EmployeesTable";
import { useThemeMediaQuery } from "@fuse/hooks";

function Employees() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageCarded
      header={<EmployeesHeader />}
      content={<EmployeesTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default Employees;