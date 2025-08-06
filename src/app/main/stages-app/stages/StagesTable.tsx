import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetStagesQuery,
  useRemoveStageMutation,
  useUpdateStageMutation,
} from "../StagesApi";
import { useTranslation } from "react-i18next";
import {
  newStagesInstance,
  resetStages,
  selectStagesDateFromFilter,
  selectStagesDateToFilter,
  selectStagesPage,
  selectStagesPageSize,
  selectStagesSearchText,
  setStagesPage,
  setStagesPageSize,
} from "../store/stagesSlice";
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
import IStage from "../models/IStage";
import localeString from "src/app/main/utils/localeString";
import { useAppSelector } from "app/store/hooks";
import { selectUser } from "src/app/auth/user/store/userSlice";

function StagesTable() {
  const { t } = useTranslation("stagesApp");
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector(selectUser);
  const routeParams = useParams();
  const [ready, setReady] = useState(false);
  const [loadingRemoveItem, setLoadingRemoveItem] = useState(null);

  const page: number = useSelector(selectStagesPage);
  const pageSize: number = useSelector(selectStagesPageSize);
  const searchText: string | null = useSelector(selectStagesSearchText);

  const dateFromFilter: string | null = useSelector(selectStagesDateFromFilter);
  const dateToFilter: string | null = useSelector(selectStagesDateToFilter);

  const {
    data: stages,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetStagesQuery(
    {
      page,
      pageSize,
      searchText,

      dateFromFilter,
      dateToFilter,
    },
    { skip: !ready, refetchOnMountOrArgChange: true }
  );
  const [removeStage] = useRemoveStageMutation();
  const [updateStage] = useUpdateStageMutation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(newStagesInstance({}));
    setReady(true);
  }, [dispatch, routeParams]);

  useEffect(() => {
    return () => {
      dispatch(resetStages(null));
    };
  }, [dispatch]);

  function onChangePagination({ page, pageSize }) {
    dispatch(setStagesPage(page));
    dispatch(setStagesPageSize(pageSize));
  }
  const fields: TableFieldProps<IStage>[] = [
    {
      id: "name",
      type: TableDataTypes.normal,
      label: t("NAME"),
      locale: true,
    },
    {
      id: "description",
      type: TableDataTypes.normal,
      label: t("DESCRIPTION"),
      locale: true,
    },
    {
      id: "imageUrl",
      type: TableDataTypes.image,
      label: t("IMAGE_URL"),
      flex: 0.3,
      minWidth: 30,
    },
    {
      id: "estimatedTimeMinutes",
      type: TableDataTypes.normal,
      label: t("ESTIMATED_TIME_MINUTES"),
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
          onActionClick: openRemoveStageDialog,
          loadingGetter: (row) => row.id === loadingRemoveItem,
        },
        {
          title: t("VIEW"),
          color: "secondary",
          link: true,
          linkGetter: (row) => `/stages/${row.id}`,
        },
      ],
    },
  ];

  function openRemoveStageDialog(stage: IStage) {
    dispatch(
      openDialog({
        children: (
          <AlertDialog
            title={t("REMOVE_FACTOR_STAGE_TITLE")}
            message={t("REMOVE_FACTOR_STAGE_MESSAGE")}
            onSubmit={() => {
              setLoadingRemoveItem(stage.id);
              removeStage(stage.id)
                .unwrap()
                .then((action) => {
                  setLoadingRemoveItem(null);
                  dispatch(
                    showMessage({
                      message: t("FACTOR_STAGE_REMOVED_SUCCESSFULLY"),
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
                      message: t(
                        "SOMETHING_WENT_WRONG_WHEN_REMOVE_FACTOR_STAGE"
                      ),
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

  return (
    <div className="w-full flex flex-col h-full">
      <CustomTable
        fields={fields}
        status={
          isLoading || isFetching ? FetchStatus.loading : FetchStatus.done
        }
        data={stages?.results || []}
        total={stages?.total || 0}
        page={page}
        pageSize={pageSize}
        onChangePagination={onChangePagination}
        checkboxSelection
      />
    </div>
  );
}

export default StagesTable;
