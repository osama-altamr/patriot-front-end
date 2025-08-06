import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import IUser from "../../models/IUser";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  alpha,
  TextField,
MenuItem,
} from "@mui/material";
import {userRole,
toUserRoleTitle,
toUserRoleColor,} from "../../Utils";
import MediaInput from "app/shared-components/media-input/MediaInput";

function BasicInfoTab({ user }: { user?: IUser }) {
  const { t } = useTranslation("usersApp");
  const methods = useFormContext<IUser>();
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
      
      <Controller
      name="name"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          className="mt-8 mb-16"
          error={!!errors.name}
          helperText={errors?.name?.message}
required

          label={t("NAME")}
          id="name"
          variant="outlined"
          fullWidth
        />
      )}
    />
<Controller
      name="email"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          className="mt-8 mb-16"
          error={!!errors.email}
          helperText={errors?.email?.message}
required

          label={t("EMAIL")}
          id="email"
          variant="outlined"
          fullWidth
        />
      )}
    />
<Controller
      name="phoneNumber"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          className="mt-8 mb-16"
          error={!!errors.phoneNumber}
          helperText={errors?.phoneNumber?.message}
          label={t("PHONE_NUMBER")}
          id="phoneNumber"
          variant="outlined"
          fullWidth
        />
      )}
    />
<MediaInput name="photoUrl" label={t("PHOTO_URL")} imageUrl={user?.photoUrl} required={false} />
<Controller
        name="role"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.role}
            helperText={errors?.role?.message}
required

            label={t("ROLE")}
            id="role"
            variant="outlined"
            fullWidth
            select
          >
            {Object.values(userRole).map((value, index) => (
              <MenuItem key={index} value={value}>
                {t(toUserRoleTitle(value))}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </div>
  );
}

export default BasicInfoTab;