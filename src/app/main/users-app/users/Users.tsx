import FusePageCarded from "@fuse/core/FusePageCarded";
import UsersHeader from "./UsersHeader";
import UsersTable from "./UsersTable";
import { useThemeMediaQuery } from "@fuse/hooks";

function Users() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageCarded
      header={<UsersHeader />}
      content={<UsersTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default Users;