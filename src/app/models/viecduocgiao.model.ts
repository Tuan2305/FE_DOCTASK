export interface ViecduocgiaoModel {
  taskId: number;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  percentageComplete: number;
  frequencyType: string; // hoặc string nếu server không cố định
  intervalValue: number;
  dayOfWeek: number[] | null;
  dayOfMonth: number[] | null;
}
