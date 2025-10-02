import { Metadata } from "../interface/response-paganation";
import { ViecduocgiaoModel } from "./viecduocgiao.model";

export interface ReminderModel {
  reminderId: number;
  title: string;
  task: ViecduocgiaoModel ;

  progressId: number | null;
  message: string;
  isRead: boolean;
  createdBy: string;
  createAt:string;

  triggerTime: string;
}
