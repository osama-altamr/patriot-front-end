export const orderPriority = {
      low: "low",
      medium: "medium",
      high: "high",
    };
    
    export const orderStatus = {
      pending: "pending",
      "in-progress": "in-progress",
      completed: "completed",
      cancelled: "cancelled",
      delivered: "delivered",
      "out-for-delivery": "out-for-delivery",
    };
    
    export const toOrderPriorityTitle = (priority) => {
      switch (priority) {
        case orderPriority.low:
          return "LOW";
        case orderPriority.medium:
          return "MEDIUM";
        case orderPriority.high:
          return "HIGH";
      }
      return "LOW";
    };
    
    export const toOrderStatusTitle = (status) => {
      switch (status) {
        case orderStatus.pending:
          return "PENDING";
        case orderStatus["in-progress"]:
          return "PROCESSING";
        case orderStatus.completed:
          return "COMPLETED";
        case orderStatus.cancelled:
          return "CANCELLED";
        case orderStatus.delivered:
          return "DELIVERED";
        case orderStatus["out-for-delivery"]:
          return "OUT_FOR_DELIVERY";
      }
      return "PENDING";
    };
    
    export const toOrderPriorityColor = (priority) => {
      switch (priority) {
        case orderPriority.low:
          return "bg-green-500";
        case orderPriority.medium:
          return "bg-orange-500";
        case orderPriority.high:
          return "bg-red-500";
      }
      return "bg-gray-500";
    };
    
    export const toOrderStatusColor = (status) => {
      switch (status) {
        case orderStatus.pending:
          return "bg-yellow-500";
        case orderStatus["in-progress"]:
          return "bg-blue-500";
        case orderStatus.completed:
          return "bg-green-500";
        case orderStatus.cancelled:
          return "bg-red-500";
        case orderStatus.delivered:
          return "bg-purple-500";
        case orderStatus["out-for-delivery"]:
          return "bg-teal-500";
      }
      return "bg-gray-500";
    };