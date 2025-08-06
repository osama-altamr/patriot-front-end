export default interface INotification {
  id: string;
  senderId?: string;
  receiverId?: string;
  senderType?: "Student" | "Organization" | "Admin";
  receiverType?: "Student" | "Organization" | "Admin";
  type?:
    | "account"
    | "order"
    | "course"
    | "certificate"
    | "request"
    | "payment"
    | "invoice"
    | "system"
    | "other";
  title?: string;
  content?: string;
  isSeen?: boolean;
  link?: string;
  variant?: "primary" | "secondary" | "success" | "info" | "warning" | "error";
  createdAt?: string;
  updatedAt?: string;
}
