import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ICategory from "../../models/ICategory";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  alpha,
  
} from "@mui/material";
import LocaleInput from "app/shared-components/locale-input/LocaleInput";
import MediaInput from "app/shared-components/media-input/MediaInput";

function BasicInfoTab({ category }: { category?: ICategory }) {
  const { t } = useTranslation("categoriesApp");
  const methods = useFormContext<ICategory>();
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
      
      <LocaleInput name="name" label={t("NAME")} requiredLanguages={[]} />
<LocaleInput name="description" label={t("DESCRIPTION")} />
<MediaInput name="imageUrl" label={t("IMAGE_URL")} imageUrl={category?.imageUrl} required={false} />
    </div>
  );
}

export default BasicInfoTab;