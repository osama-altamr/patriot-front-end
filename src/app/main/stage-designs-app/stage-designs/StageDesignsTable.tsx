import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetStageDesignsQuery,
  useRemoveStageDesignMutation,
  useUpdateStageDesignMutation,
} from "../StageDesignsApi";
import { useTranslation } from "react-i18next";
import {
  newStageDesignsInstance,
  resetStageDesigns,
  selectStageDesignsDateFromFilter,
  selectStageDesignsDateToFilter,
  selectStageDesignsPage,
  selectStageDesignsPageSize,
  selectStageDesignsSearchText,
  setStageDesignsPage,
  setStageDesignsPageSize,
  
  
} from "../store/stageDesignsSlice";
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
import IStageDesign from "../models/IStageDesign";
import localeString from "src/app/main/utils/localeString";
import { useAppSelector } from "app/store/hooks";
import { selectUser } from "src/app/auth/user/store/userSlice";


function StageDesignsTable() {
  const { t } = useTranslation("stageDesignsApp");
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector(selectUser);
  const routeParams = useParams();
  const [ready, setReady] = useState(false);
  const [loadingRemoveItem, setLoadingRemoveItem] = useState(null);
  
  const page: number = useSelector(selectStageDesignsPage);
  const pageSize: number = useSelector(selectStageDesignsPageSize);
  const searchText: string | null = useSelector(selectStageDesignsSearchText);
  
  
  const dateFromFilter: string | null = useSelector(
    selectStageDesignsDateFromFilter
  );
  const dateToFilter: string | null = useSelector(selectStageDesignsDateToFilter);

  const {
    data: stageDesigns,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetStageDesignsQuery(
    {
      page,
      pageSize,
      searchText,
      
      
      dateFromFilter,
      dateToFilter,
    },
    { skip: !ready, refetchOnMountOrArgChange: true }
  );
  const [removeStageDesign] = useRemoveStageDesignMutation();
  const [updateStageDesign] = useUpdateStageDesignMutation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(newStageDesignsInstance({}));
    setReady(true);
  }, [dispatch, routeParams]);

  useEffect(() => {
    return () => {
      dispatch(resetStageDesigns(null));
    };
  }, [dispatch]);

  function onChangePagination({ page, pageSize }) {
    dispatch(setStageDesignsPage(page));
    dispatch(setStageDesignsPageSize(pageSize));
  }
  const fields: TableFieldProps<IStageDesign>[] = [
    {
    id: "title",
type: TableDataTypes.normal,
label: t("TITLE"),
locale: true,
  },
{
    id: "imageUrl",
type: TableDataTypes.image,
label: t("IMAGE_URL"),
  },
{
    id: "stageId",
type: TableDataTypes.normal,
label: t("STAGE"),
valueGetter: (row) => localeString(row.stage?.name),
link: true,
linkGetter: (row) => `/stage/${row.stage?.id}`,
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
          onActionClick: openRemoveStageDesignDialog,
          loadingGetter: (row) => row.id === loadingRemoveItem,
        },
        {
          title: t("VIEW"),
          color: "secondary",
          link: true,
          linkGetter: (row) => `/stage-designs/${row.id}`,
        },
        
      ],
    },
  ];

  function openRemoveStageDesignDialog(stageDesign: IStageDesign) {
    dispatch(
      openDialog({
        children: (
          <AlertDialog
            title={t("REMOVE_STAGE_DESIGN_TITLE")}
            message={t("REMOVE_STAGE_DESIGN_MESSAGE")}
            onSubmit={() => {
              setLoadingRemoveItem(stageDesign.id);
              removeStageDesign(stageDesign.id)
                .unwrap()
                .then((action) => {
                  setLoadingRemoveItem(null);
                  dispatch(
                    showMessage({
                      message: t("STAGE_DESIGN_REMOVED_SUCCESSFULLY"),
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
                      message: t("SOMETHING_WENT_WRONG_WHEN_REMOVE_STAGE_DESIGN"),
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
        data={stageDesigns?.results || []}
        total={stageDesigns?.total || 0}
        page={page}
        pageSize={pageSize}
        onChangePagination={onChangePagination}
        checkboxSelection
      />
    </div>
  );
}

export default StageDesignsTable;