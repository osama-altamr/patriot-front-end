import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import IStage from "../../models/IStage";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  alpha,
  TextField,
} from "@mui/material";
import LocaleInput from "app/shared-components/locale-input/LocaleInput";
import MediaInput from "app/shared-components/media-input/MediaInput";

function BasicInfoTab({ stage }: { stage?: IStage }) {
  const { t } = useTranslation("stagesApp");
  const methods = useFormContext<IStage>();
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
<LocaleInput name="description" label={t("DESCRIPTION")} requiredLanguages={[]} />
<MediaInput name="imageUrl" label={t("IMAGE_URL")} imageUrl={stage?.imageUrl} required={false} />
<Controller
        name="estimatedTimeMinutes"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            label={t("ESTIMATED_TIME_MINUTES")}
            type="number"
            id="estimatedTimeMinutes"
            variant="outlined"
            fullWidth
            error={!!errors.estimatedTimeMinutes}
            helperText={errors?.estimatedTimeMinutes?.message}
required

            inputProps={{ inputMode: "numeric" }}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />
    </div>
  );
}

export default BasicInfoTab;