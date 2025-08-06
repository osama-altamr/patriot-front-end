import _ from "@lodash";
import { PartialDeep } from "type-fest";
import INotification from "./INotification";
import FuseUtils from "@fuse/utils";

const NotificationModel = (data: PartialDeep<INotification>) =>
  _.defaults(data || {}, {
    id: FuseUtils.generateGUID(),
    icon: "heroicons-solid:star",
    title: "",
    description: "",
    time: new Date().toISOString(),
    read: false,
    variant: "default",
  });
export const notificationDefaultValues = NotificationModel({});
export const notificationEditableFields = [
  "structures",
  "title",
  "url",
  "pdfUrl",
  "active",
];

export default NotificationModel;
