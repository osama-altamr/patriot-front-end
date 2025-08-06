import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetMaterialsQuery,
  useRemoveMaterialMutation,
  useUpdateMaterialMutation,
} from "../MaterialsApi";
import { useTranslation } from "react-i18next";
import {
  newMaterialsInstance,
  resetMaterials,
  selectMaterialsDateFromFilter,
  selectMaterialsDateToFilter,
  selectMaterialsPage,
  selectMaterialsPageSize,
  selectMaterialsSearchText,
  setMaterialsPage,
  setMaterialsPageSize,
  
  selectMaterialsTypeFilter,
selectMaterialsGlassTypeFilter,
} from "../store/materialsSlice";
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
import IMaterial from "../models/IMaterial";
import localeString from "src/app/main/utils/localeString";
import { useAppSelector } from "app/store/hooks";
import { selectUser } from "src/app/auth/user/store/userSlice";
import {materialType,
toMaterialTypeTitle,
toMaterialTypeColor,
materialGlassType,
toMaterialGlassTypeTitle,
toMaterialGlassTypeColor,} from "../Utils";

function MaterialsTable() {
  const { t } = useTranslation("materialsApp");
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector(selectUser);
  const routeParams = useParams();
  const [ready, setReady] = useState(false);
  const [loadingRemoveItem, setLoadingRemoveItem] = useState(null);
  
  const page: number = useSelector(selectMaterialsPage);
  const pageSize: number = useSelector(selectMaterialsPageSize);
  const searchText: string | null = useSelector(selectMaterialsSearchText);
  
  const typeFilter: string | null = useSelector(selectMaterialsTypeFilter);
const glassTypeFilter: string | null = useSelector(selectMaterialsGlassTypeFilter);
  const dateFromFilter: string | null = useSelector(
    selectMaterialsDateFromFilter
  );
  const dateToFilter: string | null = useSelector(selectMaterialsDateToFilter);

  const {
    data: materials,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetMaterialsQuery(
    {
      page,
      pageSize,
      searchText,
      
      typeFilter,
glassTypeFilter,
      dateFromFilter,
      dateToFilter,
    },
    { skip: !ready, refetchOnMountOrArgChange: true }
  );
  const [removeMaterial] = useRemoveMaterialMutation();
  const [updateMaterial] = useUpdateMaterialMutation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(newMaterialsInstance({}));
    setReady(true);
  }, [dispatch, routeParams]);

  useEffect(() => {
    return () => {
      dispatch(resetMaterials(null));
    };
  }, [dispatch]);

  function onChangePagination({ page, pageSize }) {
    dispatch(setMaterialsPage(page));
    dispatch(setMaterialsPageSize(pageSize));
  }
  const fields: TableFieldProps<IMaterial>[] = [
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
  },
{
    id: "height",
type: TableDataTypes.normal,
label: t("HEIGHT"),
  },
{
    id: "width",
type: TableDataTypes.normal,
label: t("WIDTH"),
  },
{
    id: "quantity",
type: TableDataTypes.normal,
label: t("QUANTITY"),
flex: 0.5,
minWidth: 50,
  },
{
    id: "type",
type: TableDataTypes.normal,
label: t("TYPE"),
chip: true,
toChipTitle: (value) => t(toMaterialTypeTitle(value)),
toChipColor: toMaterialTypeColor,
flex: 0.6,
minWidth: 60,
  },
{
    id: "location",
type: TableDataTypes.normal,
label: t("LOCATION"),
flex: 0.6,
minWidth: 60,
  },
{
    id: "glassType",
type: TableDataTypes.normal,
label: t("GLASS_TYPE"),
chip: true,
toChipTitle: (value) => t(toMaterialGlassTypeTitle(value)),
toChipColor: toMaterialGlassTypeColor,
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
          onActionClick: openRemoveMaterialDialog,
          loadingGetter: (row) => row.id === loadingRemoveItem,
        },
        {
          title: t("VIEW"),
          color: "secondary",
          link: true,
          linkGetter: (row) => `/materials/${row.id}`,
        },
        
      ],
    },
  ];

  function openRemoveMaterialDialog(material: IMaterial) {
    dispatch(
      openDialog({
        children: (
          <AlertDialog
            title={t("REMOVE_MATERIAL_TITLE")}
            message={t("REMOVE_MATERIAL_MESSAGE")}
            onSubmit={() => {
              setLoadingRemoveItem(material.id);
              removeMaterial(material.id)
                .unwrap()
                .then((action) => {
                  setLoadingRemoveItem(null);
                  dispatch(
                    showMessage({
                      message: t("MATERIAL_REMOVED_SUCCESSFULLY"),
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
                      message: t("SOMETHING_WENT_WRONG_WHEN_REMOVE_MATERIAL"),
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
        data={materials?.results || []}
        total={materials?.total || 0}
        page={page}
        pageSize={pageSize}
        onChangePagination={onChangePagination}
        checkboxSelection
      />
    </div>
  );
}

export default MaterialsTable;