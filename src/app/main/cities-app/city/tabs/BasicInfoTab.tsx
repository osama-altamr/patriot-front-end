import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ICity from "../../models/ICity";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  alpha,
  
} from "@mui/material";
import CustomAutoComplete from "app/shared-components/custom-auto-complete/CustomAutoComplete";
import LocaleInput from "app/shared-components/locale-input/LocaleInput";

function BasicInfoTab({ city }: { city?: ICity }) {
  const { t } = useTranslation("citiesApp");
  const methods = useFormContext<ICity>();
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
          name="active"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              {...field}
              className="mb-8"
              control={
                <Checkbox checked={field.value} color="primary" id="active" />
              }
              label={t("ACTIVATE_AFTER_CREATE")}
            />
          )}
        />
      )}
      <CustomAutoComplete
    name="stateId"
    label={t("STATE")}
    placeholder={t("SELECT_SINGLE_STATE")}
    getItemUrl="v1/states"
    getItemsUrl="v1/states"
    defaultItem={city?.state}
    defaultItemId={city?.stateId}
  />
<LocaleInput name="name" label={t("NAME")} />
    </div>
  );
}

export default BasicInfoTab;