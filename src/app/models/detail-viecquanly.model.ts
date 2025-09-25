export interface DetailViecquanlyModel {
  TaskId: number;
  Title: string;
  Description: string;
  StartDate: string; // ISO format date string
  DueDate: string; // ISO format date string
  PercentageComplete: number;
  AssigneeFullNames: string[];
  FrequencyType: string; // hoặc string nếu server không cố định
  IntervalValue: number;
  dayOfWeek: number[] | null;
  dayOfMonth: number[] | null;
}
