import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetStatesQuery,
  useRemoveStateMutation,
  useUpdateStateMutation,
} from "../StatesApi";
import { useTranslation } from "react-i18next";
import {
  newStatesInstance,
  resetStates,
  selectStatesDateFromFilter,
  selectStatesDateToFilter,
  selectStatesPage,
  selectStatesPageSize,
  selectStatesSearchText,
  setStatesPage,
  setStatesPageSize,
  selectStatesActiveFilter,
  
} from "../store/statesSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch } from "app/store/store";
import { openDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import AlertDialog from "app/shared-components/alert-dialog/AlertDialog";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  TableDataTypes,
  TableFieldProps,
} from "app/shared-components/custom-table/Utils";
import CustomTable from "app/shared-components/custom-table/CustomTable";
import { FetchStatus } from "src/app/main/utils/dataStatus";
import IState from "../models/IState";
import localeString from "src/app/main/utils/localeString";
import { useAppSelector } from "app/store/hooks";
import { selectUser } from "src/app/auth/user/store/userSlice";


function StatesTable() {
  const { t } = useTranslation("statesApp");
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector(selectUser);
  const routeParams = useParams();
  const [ready, setReady] = useState(false);
  const [loadingRemoveItem, setLoadingRemoveItem] = useState(null);
  const [loadingActivateItem, setLoadingActivateItem] = useState(null);
  const [loadingDeactivateItem, setLoadingDeactivateItem] = useState(null);
  const page: number = useSelector(selectStatesPage);
  const pageSize: number = useSelector(selectStatesPageSize);
  const searchText: string | null = useSelector(selectStatesSearchText);
  const activeFilter: string | null = useSelector(selectStatesActiveFilter);
  
  const dateFromFilter: string | null = useSelector(
    selectStatesDateFromFilter
  );
  const dateToFilter: string | null = useSelector(selectStatesDateToFilter);

  const {
    data: states,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetStatesQuery(
    {
      page,
      pageSize,
      searchText,
      activeFilter,
      
      dateFromFilter,
      dateToFilter,
    },
    { skip: !ready, refetchOnMountOrArgChange: true }
  );
  const [removeState] = useRemoveStateMutation();
  const [updateState] = useUpdateStateMutation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(newStatesInstance({}));
    setReady(true);
  }, [dispatch, routeParams]);

  useEffect(() => {
    return () => {
      dispatch(resetStates(null));
    };
  }, [dispatch]);

  function onChangePagination({ page, pageSize }) {
    dispatch(setStatesPage(page));
    dispatch(setStatesPageSize(pageSize));
  }
  const fields: TableFieldProps<IState>[] = [
    {
    id: "name",
type: TableDataTypes.normal,
label: t("NAME"),
locale: true,
  },
    {
      id: "active",
      type: TableDataTypes.bool,
      label: t("STATUS"),
      flex: 0.5,
      minWidth: 50,
    },
    {
      id: "createdAt",
      type: TableDataTypes.date,
      label: t("CREATED_AT"),
      flex: 0.8,
      minWidth: 80,
    },
    {
      id: "actions",
      label: t("ACTIONS"),
      type: TableDataTypes.actions,
      actions: [
        {
          title: t("REMOVE"),
          color: "error",
          onActionClick: openRemoveStateDialog,
          loadingGetter: (row) => row.id === loadingRemoveItem,
        },
        {
          title: t("VIEW"),
          color: "secondary",
          link: true,
          linkGetter: (row) => `/states/${row.id}`,
        },
        {
          title: t("ACTIVATE"),
          color: "success",
          onActionClick: activateState,
          loadingGetter: (row) => row.id === loadingActivateItem,
          conditions: [{ id: "active", equalsTo: false }],
        },
        {
          title: t("DEACTIVATE"),
          color: "error",
          onActionClick: deactivateState,
          loadingGetter: (row) => row.id === loadingDeactivateItem,
          conditions: [{ id: "active", equalsTo: true }],
        },
      ],
    },
  ];

  function openRemoveStateDialog(state: IState) {
    dispatch(
      openDialog({
        children: (
          <AlertDialog
            title={t("REMOVE_STATE_TITLE")}
            message={t("REMOVE_STATE_MESSAGE")}
            onSubmit={() => {
              setLoadingRemoveItem(state.id);
              removeState(state.id)
                .unwrap()
                .then((action) => {
                  setLoadingRemoveItem(null);
                  dispatch(
                    showMessage({
                      message: t("STATE_REMOVED_SUCCESSFULLY"),
                      variant: "success",
                      autoHideDuration: 2000,
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                      },
                    })
                  );
                  refetch();
                })
                .catch((e) => {
                  setLoadingRemoveItem(null);
                  dispatch(
                    showMessage({
                      message: t("SOMETHING_WENT_WRONG_WHEN_REMOVE_STATE"),
                      variant: "error",
                      autoHideDuration: 2000,
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                      },
                    })
                  );
                });
            }}
          />
        ),
      })
    );
  }

  function activateState(state: IState) {
    setLoadingActivateItem(state.id);
    updateState({ id: state.id, active: true })
      .unwrap()
      .then((action) => {
        setLoadingActivateItem(null);
        dispatch(
          showMessage({
            message: t("STATE_ACTIVATED_SUCCESSFULLY"),
            variant: "success",
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          })
        );
        refetch();
      })
      .catch((e) => {
        setLoadingActivateItem(null);
        dispatch(
          showMessage({
            message: t("SOMETHING_WENT_WRONG_WHEN_ACTIVATE_STATE"),
            variant: "error",
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          })
        );
      });
  }

  function deactivateState(state: IState) {
    setLoadingDeactivateItem(state.id);
    updateState({ id: state.id, active: false })
      .unwrap()
      .then((action) => {
        setLoadingDeactivateItem(null);
        dispatch(
          showMessage({
            message: t("STATE_DEACTIVATED_SUCCESSFULLY"),
            variant: "success",
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          })
        );
        refetch();
      })
      .catch((e) => {
        setLoadingDeactivateItem(null);
        dispatch(
          showMessage({
            message: t("SOMETHING_WENT_WRONG_WHEN_DEACTIVATE_STATE"),
            variant: "error",
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          })
        );
      });
  }

  return (
    <div className="w-full flex flex-col h-full">
      <CustomTable
        fields={fields}
        status={
          isLoading || isFetching ? FetchStatus.loading : FetchStatus.done
        }
        data={states?.results || []}
        total={states?.total || 0}
        page={page}
        pageSize={pageSize}
        onChangePagination={onChangePagination}
        checkboxSelection
      />
    </div>
  );
}

export default StatesTable;