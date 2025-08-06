import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import IReport from "../../models/IReport";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  alpha,
  TextField,
MenuItem,
} from "@mui/material";
import {reportType,
toReportTypeTitle,
toReportTypeColor,} from "../../Utils";
import LocaleInput from "app/shared-components/locale-input/LocaleInput";
import { DatePicker } from "@mui/x-date-pickers";

function BasicInfoTab({ report }: { report?: IReport }) {
  const { t } = useTranslation("reportsApp");
  const methods = useFormContext<IReport>();
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
      
      <LocaleInput name="name" label={t("NAME")} />
<Controller
        name="type"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.type}
            helperText={errors?.type?.message}
required

            label={t("TYPE")}
            id="type"
            variant="outlined"
            fullWidth
            select
          >
            {Object.values(reportType).map((value, index) => (
              <MenuItem key={index} value={value}>
                {t(toReportTypeTitle(value))}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
<Controller
          name="startDate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              value={new Date(value)}
              onChange={(date) => onChange(date.toISOString())}
              slotProps={{
                textField: {
                  className: "mt-8 mb-16",
                  label: t("START_DATE"),
                  variant: "outlined",
                  error: !!errors.startDate,
                  helperText: errors?.startDate?.message,
                  fullWidth: true,
required: true,
,
                },
              }}
              format={"dd/MM/yyyy"}
            />
          )}
        />
    </div>
  );
}

export default BasicInfoTab;