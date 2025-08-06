export const userRole = {
  user: "user",
admin: "admin",
};
export const toUserRoleTitle = (role) => {
  switch (role) {
    case userRole.user:
      return "USER";
case userRole.admin:
      return "ADMIN";
  }
  return "USER";
};
export const toUserRoleColor = (role) => {
  switch (role) {
    case userRole.user:
      return "bg-blue-500";
case userRole.admin:
      return "bg-blue-500";
  }
  return "bg-blue-500";
};