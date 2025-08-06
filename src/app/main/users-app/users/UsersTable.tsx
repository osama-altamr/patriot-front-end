import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetUsersQuery,
  useRemoveUserMutation,
  useUpdateUserMutation,
} from "../UsersApi";
import { useTranslation } from "react-i18next";
import {
  newUsersInstance,
  resetUsers,
  selectUsersDateFromFilter,
  selectUsersDateToFilter,
  selectUsersPage,
  selectUsersPageSize,
  selectUsersSearchText,
  setUsersPage,
  setUsersPageSize,
  
  selectUsersRoleFilter,
} from "../store/usersSlice";
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
import IUser from "../models/IUser";
import localeString from "src/app/main/utils/localeString";
import { useAppSelector } from "app/store/hooks";
import { selectUser } from "src/app/auth/user/store/userSlice";
import {userRole,
toUserRoleTitle,
toUserRoleColor,} from "../Utils";

function UsersTable() {
  const { t } = useTranslation("usersApp");
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector(selectUser);
  const routeParams = useParams();
  const [ready, setReady] = useState(false);
  const [loadingRemoveItem, setLoadingRemoveItem] = useState(null);
  
  const page: number = useSelector(selectUsersPage);
  const pageSize: number = useSelector(selectUsersPageSize);
  const searchText: string | null = useSelector(selectUsersSearchText);
  
  const roleFilter: string | null = useSelector(selectUsersRoleFilter);
  const dateFromFilter: string | null = useSelector(
    selectUsersDateFromFilter
  );
  const dateToFilter: string | null = useSelector(selectUsersDateToFilter);

  const {
    data: users,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetUsersQuery(
    {
      page,
      pageSize,
      searchText,
      
      roleFilter,
      dateFromFilter,
      dateToFilter,
    },
    { skip: !ready, refetchOnMountOrArgChange: true }
  );
  const [removeUser] = useRemoveUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(newUsersInstance({}));
    setReady(true);
  }, [dispatch, routeParams]);

  useEffect(() => {
    return () => {
      dispatch(resetUsers(null));
    };
  }, [dispatch]);

  function onChangePagination({ page, pageSize }) {
    dispatch(setUsersPage(page));
    dispatch(setUsersPageSize(pageSize));
  }
  const fields: TableFieldProps<IUser>[] = [
    {
    id: "name",
type: TableDataTypes.normal,
label: t("NAME"),
  },
{
    id: "email",
type: TableDataTypes.normal,
label: t("EMAIL"),
  },
{
    id: "phoneNumber",
type: TableDataTypes.normal,
label: t("PHONE_NUMBER"),
  },
{
    id: "photoUrl",
type: TableDataTypes.image,
label: t("PHOTO_URL"),
  },
{
    id: "role",
type: TableDataTypes.normal,
label: t("ROLE"),
chip: true,
toChipTitle: (value) => t(toUserRoleTitle(value)),
toChipColor: toUserRoleColor,
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
          onActionClick: openRemoveUserDialog,
          loadingGetter: (row) => row.id === loadingRemoveItem,
        },
        {
          title: t("VIEW"),
          color: "secondary",
          link: true,
          linkGetter: (row) => `/users/${row.id}`,
        },
        
      ],
    },
  ];

  function openRemoveUserDialog(user: IUser) {
    dispatch(
      openDialog({
        children: (
          <AlertDialog
            title={t("REMOVE_USER_TITLE")}
            message={t("REMOVE_USER_MESSAGE")}
            onSubmit={() => {
              setLoadingRemoveItem(user.id);
              removeUser(user.id)
                .unwrap()
                .then((action) => {
                  setLoadingRemoveItem(null);
                  dispatch(
                    showMessage({
                      message: t("USER_REMOVED_SUCCESSFULLY"),
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
                      message: t("SOMETHING_WENT_WRONG_WHEN_REMOVE_USER"),
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
        data={users?.results || []}
        total={users?.total || 0}
        page={page}
        pageSize={pageSize}
        onChangePagination={onChangePagination}
        checkboxSelection
      />
    </div>
  );
}

export default UsersTable;