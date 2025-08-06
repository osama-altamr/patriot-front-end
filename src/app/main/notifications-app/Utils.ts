import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";

i18next.addResourceBundle("en", "notificationsApp", en);
i18next.addResourceBundle("ar", "notificationsApp", ar);

export const notificationUserTypes = {
  student: "Student",
  organization: "Organization",
  admin: "Admin",
};

export const notificationTypes = {
  account: "account",
  order: "order",
  course: "course",
  certificate: "certificate",
  request: "request",
  payment: "payment",
  invoice: "invoice",
  system: "system",
  other: "other",
};

export const toNotificationTypeTitle = (type) => {
  switch (type) {
    case notificationTypes.account:
      return "ACCOUNT_TITLE";
    case notificationTypes.order:
      return "ORDER_TITLE";
    case notificationTypes.course:
      return "COURSE_TITLE";
    case notificationTypes.certificate:
      return "CERTIFICATE_TITLE";
    case notificationTypes.request:
      return "REQUEST_TITLE";
    case notificationTypes.payment:
      return "PAYMENT_TITLE";
    case notificationTypes.invoice:
      return "INVOICE_TITLE";
    case notificationTypes.system:
      return "SYSTEM_TITLE";
    case notificationTypes.other:
      return "OTHER_TITLE";
  }
  return "";
};
export const toNotificationTypeIcon = (type) => {
  switch (type) {
    case notificationTypes.account:
      return "material-solid:person_outline";
    case notificationTypes.order:
      return "material-solid:request_page";
    case notificationTypes.course:
      return "heroicons-solid:document-text";
    case notificationTypes.certificate:
      return "feather:award";
    case notificationTypes.request:
      return "material-solid:announcement";
    case notificationTypes.payment:
      return "material-solid:monetization_on";
    case notificationTypes.invoice:
      return "material-solid:request_page";
    case notificationTypes.system:
      return "material-solid:error";
    case notificationTypes.other:
      return "material-solid:error";
  }
  return "";
};
