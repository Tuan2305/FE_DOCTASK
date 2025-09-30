import { Metadata } from "../interface/response-paganation";

export interface ReminderModel {
  reminderId: number;
  title: string;
  taskid: number | null;
  progressId: number | null;
  message: string;
  type: string;
  isNotified: boolean;
  createdByName: string;
  triggerTime: string;
}
