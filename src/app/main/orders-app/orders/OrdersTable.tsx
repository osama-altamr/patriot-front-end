import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetOrdersQuery, useRemoveOrderMutation } from "../OrdersApi";
import { useTranslation } from "react-i18next";
import {
  selectOrdersPage,
  selectOrdersPageSize,
  selectOrdersSearchText,
  setOrdersPage,
  setOrdersPageSize,
  selectOrdersPriorityFilter,
  selectOrdersStatusFilter,
  selectOrdersUserIdFilter,
  selectOrdersDriverIdFilter,
  selectOrdersDateFromFilter,
  selectOrdersDateToFilter,
} from "../store/ordersSlice";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "app/store/store";
import { openDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import AlertDialog from "app/shared-components/alert-dialog/AlertDialog";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { TableDataTypes, TableFieldProps } from "app/shared-components/custom-table/Utils";
import CustomTable from "app/shared-components/custom-table/CustomTable";
import { FetchStatus } from "src/app/main/utils/dataStatus";
import IOrder from "../models/IOrder";
import localeString from "src/app/main/utils/localeString";
import {
  toOrderPriorityTitle,
  toOrderPriorityColor,
  toOrderStatusTitle,
  toOrderStatusColor,
} from "../Utils";

function OrdersTable() {
  const { t } = useTranslation("ordersApp");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [loadingRemoveItem, setLoadingRemoveItem] = useState(null);
  
  const page = useSelector(selectOrdersPage);
  const pageSize = useSelector(selectOrdersPageSize);
  const searchText = useSelector(selectOrdersSearchText);
  const priorityFilter = useSelector(selectOrdersPriorityFilter);
  const statusFilter = useSelector(selectOrdersStatusFilter);
  const userIdFilter = useSelector(selectOrdersUserIdFilter);
  const driverIdFilter = useSelector(selectOrdersDriverIdFilter);
  const dateFromFilter = useSelector(selectOrdersDateFromFilter);
  const dateToFilter = useSelector(selectOrdersDateToFilter);

  const { data, isLoading, isFetching, error, refetch } = useGetOrdersQuery({
    page,
    pageSize,
    searchText,
    priorityFilter,
    statusFilter,
    userIdFilter,
    driverIdFilter,
    dateFromFilter,
    dateToFilter,
  }, { refetchOnMountOrArgChange: true });

  const [removeOrder] = useRemoveOrderMutation();

  const fields: TableFieldProps<IOrder>[] = [
    {
      id: "ref",
      type: TableDataTypes.normal,
      label: t("REF"),
      flex: 0.8,
    },
    {
      id: "user",
      type: TableDataTypes.normal,
      label: t("USER"),
      valueGetter: (row) => row.user?.name ? row.user.name : 'N/A',
      link: true,
      linkGetter: (row) => row.user?.id ? `v1/users/${row.user.id}` : '#',
    },
    {
      id: "driver",
      type: TableDataTypes.normal,
      label: t("DRIVER"),
      valueGetter: (row) => row.driver?.name ? row.driver.name : t('NOT_ASSIGNED'),
      link: true,
      linkGetter: (row) => row.driver?.id ? `v1/users/${row.driver.id}` : '#',
    },
    {
      id: "priority",
      type: TableDataTypes.normal,
      label: t("PRIORITY"),
      chip: true,
      toChipTitle: (value) => t(toOrderPriorityTitle(value)),
      toChipColor: toOrderPriorityColor,
    },
    {
      id: "status",
      type: TableDataTypes.normal,
      label: t("STATUS"),
      chip: true,
      toChipTitle: (value) => t(toOrderStatusTitle(value)),
      toChipColor: toOrderStatusColor,
    },
    {
      id: "outForDeliveryAt",
      type: TableDataTypes.date,
      label: t("OUT_FOR_DELIVERY_AT"),
    },
    {
      id: "deliveredAt",
      type: TableDataTypes.date,
      label: t("DELIVERED_AT"),
    },
    {
      id: "createdAt",
      type: TableDataTypes.date,
      label: t("CREATED_AT"),
    },
    {
      id: "actions",
      label: t("ACTIONS"),
      type: TableDataTypes.actions,
      actions: [
        {
          title: t("REMOVE"),
          color: "error",
          onActionClick: (order) => openRemoveOrderDialog(order),
          loadingGetter: (row) => row.id === loadingRemoveItem,
        },
        {
          title: t("VIEW"),
          color: "secondary",
          onActionClick: (row) => navigate(`/orders/${row.id}`),
        },
      ],
    },
  ];

  function openRemoveOrderDialog(order: IOrder) {
    dispatch(
      openDialog({
        children: (
          <AlertDialog
            title={t("REMOVE_ORDER_TITLE")}
            message={t("REMOVE_ORDER_MESSAGE")}
            onSubmit={() => {
              setLoadingRemoveItem(order.id);
              removeOrder(order.id)
                .unwrap()
                .then(() => {
                  dispatch(showMessage({ message: t("ORDER_REMOVED_SUCCESSFULLY"), variant: "success" }));
                  refetch();
                })
                .catch(() => {
                  dispatch(showMessage({ message: t("SOMETHING_WENT_WRONG_WHEN_REMOVE_ORDER"), variant: "error" }));
                })
                .finally(() => setLoadingRemoveItem(null));
            }}
          />
        ),
      })
    );
  }

  return (
    <div className="w-full flex flex-col h-full">
      <CustomTable
        fields={fields}
        status={isLoading || isFetching ? FetchStatus.loading : FetchStatus.done}
        data={data?.results || []}
        total={data?.total || 0}
        page={page}
        pageSize={pageSize}
        onChangePagination={({ page, pageSize }) => {
          dispatch(setOrdersPage(page));
          dispatch(setOrdersPageSize(pageSize));
        }}
      />
    </div>
  );
}

export default OrdersTable;