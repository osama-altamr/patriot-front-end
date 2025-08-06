export const reportType = {
  employee: "employee",
order: "order",
complaint: "complaint",
};
export const toReportTypeTitle = (type) => {
  switch (type) {
    case reportType.employee:
      return "EMPLOYEES";
case reportType.order:
      return "ORDERS";
case reportType.complaint:
      return "COMPLAINTS";
  }
  return "EMPLOYEES";
};
export const toReportTypeColor = (type) => {
  switch (type) {
    case reportType.employee:
      return "bg-blue-500";
case reportType.order:
      return "bg-blue-500";
case reportType.complaint:
      return "bg-blue-500";
  }
  return "bg-blue-500";
};