import FusePageCarded from "@fuse/core/FusePageCarded";
import OrdersHeader from "./OrdersHeader";
import OrdersTable from "./OrdersTable";
import { useThemeMediaQuery } from "@fuse/hooks";

function Orders() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <FusePageCarded
      header={<OrdersHeader />}
      content={<OrdersTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default Orders;