import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  useCreateOperationMutation,
  useRemoveOperationMutation,
  useUpdateOperationMutation,
} from "../OperationsApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "app/store/store";
import { openDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import AlertDialog from "app/shared-components/alert-dialog/AlertDialog";
import { useState } from "react";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { LoadingButton } from "@mui/lab";
import Icon from "app/shared-components/Icon";
import IOperation from "../models/IOperation";
import localeString from "src/app/main/utils/localeString";
import { useAppSelector } from "app/store/hooks";
import { selectUser } from "src/app/auth/user/store/userSlice";

function OperationHeader() {
  const dispatch = useDispatch<AppDispatch>();
  const routeParams = useParams();
  const { operationId } = routeParams;
  const { t } = useTranslation("operationsApp");
  const [loading, setLoading] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [loadingActivate, setLoadingActivate] = useState(false);
  const [loadingDeactivate, setLoadingDeactivate] = useState(false);

  const [updateOperation] = useUpdateOperationMutation();
  const [createOperation] = useCreateOperationMutation();
  const [removeOperation] = useRemoveOperationMutation();
  const methods = useFormContext<IOperation>();
  const { formState, watch, handleSubmit, getValues } = methods;
  const { isValid, dirtyFields } = formState;

  const theme = useTheme();
  const navigate = useNavigate();
  const { id, name } = watch();
  function optimizeOperation(data: IOperation) {
    const operationData = { ...data };
    delete operationData.createdAt;
    delete operationData.updatedAt;
    return operationData;
  }
  function handleSaveOperation() {
    const onSubmit = () => {
      setLoading(true);
      (id && id !== "new" ? updateOperation : createOperation)(
        optimizeOperation(getValues())
      )
        .unwrap()
        .then(() => {
          setLoading(false);
          dispatch(
            showMessage({
              message: t(`OPERATION_SAVED_SUCCESSFULLY`),
              variant: "success",
              autoHideDuration: 2000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            })
          );
          navigate(`/operations`);
        })
        .catch(() => {
          setLoading(false);
          dispatch(
            showMessage({
              message: t(`SOMETHING_WENT_WRONG_WHEN_SAVE_OPERATION`),
              variant: "error",
              autoHideDuration: 2000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            })
          );
        });
    };
    handleSubmit(onSubmit)();
  }

  

  

  return (
    <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 sm:py-32 px-24 md:px-32">
      <div className="flex flex-col items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
        >
          <Typography
            className="flex items-center sm:mb-12"
            component={Link}
            role="button"
            to={`/operations`}
            color="inherit"
          >
            <FuseSvgIcon size={20}>
              {theme.direction === "ltr"
                ? "heroicons-outline:arrow-sm-left"
                : "heroicons-outline:arrow-sm-right"}
            </FuseSvgIcon>
            <span className="flex mx-4 font-medium">{t(`OPERATIONS`)}</span>
          </Typography>
        </motion.div>

        <div className="flex items-center max-w-full">
          <motion.div
            className="flex flex-col min-w-0 mx-8 sm:mx-16"
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.3 } }}
          >
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              {t(`OPERATION_DETAILS`)}
            </Typography>
            <Typography variant="caption" className="font-medium">
              {name ? `${localeString(name) ?? ""}` : t(`OPERATION`)}
            </Typography>
          </motion.div>
        </div>
      </div>
      
      
      <motion.div
          className="flex flex-1 w-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
        >
          <LoadingButton
            className="whitespace-nowrap mx-4"
            variant="contained"
            color="secondary"
            onClick={handleSaveOperation}
            startIcon={<Icon type="fa6" name="FaFloppyDisk" size="0.8em" />}
            loadingPosition="start"
            loading={loading}
            disabled={
              id && id !== "new" && (_.isEmpty(dirtyFields) || !isValid)
            }
          >
            <span>{t(`${id && id !== "new" ? "SAVE" : "CREATE"}_OPERATION`)}</span>
          </LoadingButton>
        </motion.div>
    </div>
  );
}

export default OperationHeader;
