export const operationStatus = {
  pending: "pending",
inProgress: "inProgress",
completed: "completed",
};
export const toOperationStatusTitle = (status) => {
  switch (status) {
    case operationStatus.pending:
      return "PENDING";
case operationStatus.inProgress:
      return "IN_PROGRESS";
case operationStatus.completed:
      return "COMPLETED";
  }
  return "PENDING";
};
export const toOperationStatusColor = (status) => {
  switch (status) {
    case operationStatus.pending:
      return "bg-blue-500";
case operationStatus.inProgress:
      return "bg-blue-500";
case operationStatus.completed:
      return "bg-blue-500";
  }
  return "bg-blue-500";
};