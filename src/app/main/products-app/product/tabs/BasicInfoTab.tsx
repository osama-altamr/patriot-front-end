import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import IProduct from "../../models/IProduct";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  alpha,
  TextField,
} from "@mui/material";
import CustomAutoComplete from "app/shared-components/custom-auto-complete/CustomAutoComplete";
import LocaleInput from "app/shared-components/locale-input/LocaleInput";
import MediaInput from "app/shared-components/media-input/MediaInput";

function BasicInfoTab({ product }: { product?: IProduct }) {
  const { t } = useTranslation("productsApp");
  const methods = useFormContext<IProduct>();
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
      <LocaleInput
        name="description"
        label={t("DESCRIPTION")}
        requiredLanguages={[]}
      />
      <MediaInput
        name="imageUrl"
        label={t("IMAGE_URL")}
        imageUrl={product?.imageUrl}
        required={false}
      />
      <Controller
        name="height"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            label={t("HEIGHT")}
            type="number"
            id="height"
            variant="outlined"
            fullWidth
            error={!!errors.height}
            helperText={errors?.height?.message}
            inputProps={{ inputMode: "numeric" }}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />
      <Controller
        name="width"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            label={t("WIDTH")}
            type="number"
            id="width"
            variant="outlined"
            fullWidth
            error={!!errors.width}
            helperText={errors?.width?.message}
            inputProps={{ inputMode: "numeric" }}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />
      <CustomAutoComplete
        name="categoryId"
        label={t("CATEGORY")}
        placeholder={t("SELECT_SINGLE_CATEGORY")}
        getItemUrl="v1/categories"
        getItemsUrl="v1/categories"
        defaultItem={product?.category}
        defaultItemId={product?.categoryId}
      />
    </div>
  );
}

export default BasicInfoTab;
