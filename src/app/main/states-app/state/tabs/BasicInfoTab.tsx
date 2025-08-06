import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import IState from "../../models/IState";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  alpha,
  
} from "@mui/material";
import LocaleInput from "app/shared-components/locale-input/LocaleInput";

function BasicInfoTab({ state }: { state?: IState }) {
  const { t } = useTranslation("statesApp");
  const methods = useFormContext<IState>();
  const { control, formState, watch, getFieldState, getValues } = methods;
  const { errors } = formState;
  const { id } = watch();
  console.log(getValues());
  return (
    <div>
      <Box
        component="div"
        className="py-8 px-16 my-16 w-full rounded-lg"
        sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}
      >
        <Typography className="text-17 font-bold">
          {t("MAIN_INFORMATION")}
        </Typography>
      </Box>
      {!(id && id !== "new") && (
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              {...field}
              className="mb-8"
              control={
                <Checkbox checked={field.value} color="primary" id="isActive" />
              }
              label={t("ACTIVATE_AFTER_CREATE")}
            />
          )}
        />
      )}
      <LocaleInput name="name" label={t("NAME")} />
    </div>
  );
}

export default BasicInfoTab;