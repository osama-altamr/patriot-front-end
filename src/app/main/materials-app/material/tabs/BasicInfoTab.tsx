import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import IMaterial from "../../models/IMaterial";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  alpha,
  TextField,
MenuItem,
} from "@mui/material";
import {materialType,
toMaterialTypeTitle,
toMaterialTypeColor,
materialGlassType,
toMaterialGlassTypeTitle,
toMaterialGlassTypeColor,} from "../../Utils";
import LocaleInput from "app/shared-components/locale-input/LocaleInput";
import MediaInput from "app/shared-components/media-input/MediaInput";

function BasicInfoTab({ material }: { material?: IMaterial }) {
  const { t } = useTranslation("materialsApp");
  const methods = useFormContext<IMaterial>();
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
<MediaInput name="imageUrl" label={t("IMAGE_URL")} imageUrl={material?.imageUrl} required={false} />
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
<Controller
        name="type"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.type}
            helperText={errors?.type?.message}
            label={t("TYPE")}
            id="type"
            variant="outlined"
            fullWidth
            select
          >
            {Object.values(materialType).map((value, index) => (
              <MenuItem key={index} value={value}>
                {t(toMaterialTypeTitle(value))}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
<Controller
        name="quantity"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            label={t("QUANTITY")}
            type="number"
            id="quantity"
            variant="outlined"
            fullWidth
            error={!!errors.quantity}
            helperText={errors?.quantity?.message}
required

            inputProps={{ inputMode: "numeric" }}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />
<Controller
      name="location"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          className="mt-8 mb-16"
          error={!!errors.location}
          helperText={errors?.location?.message}
          label={t("LOCATION")}
          id="location"
          variant="outlined"
          fullWidth
        />
      )}
    />
<Controller
        name="glassType"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.glassType}
            helperText={errors?.glassType?.message}
            label={t("GLASS_TYPE")}
            id="glassType"
            variant="outlined"
            fullWidth
            select
          >
            {Object.values(materialGlassType).map((value, index) => (
              <MenuItem key={index} value={value}>
                {t(toMaterialGlassTypeTitle(value))}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </div>
  );
}

export default BasicInfoTab;