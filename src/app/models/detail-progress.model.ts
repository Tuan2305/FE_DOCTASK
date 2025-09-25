export interface DetailProgressTaskParentModel {
  taskId: number;
  taskName: string;
  description: string;
  taskStatus: string;
  assigneeFullNames: string[];
  startDate: string | null;
  dueDate: string | null;
  children: DetailProgressTaskChildModel[];
}
export interface DetailProgressTaskChildModel {
  taskId: number;
  taskName: string;
  description: string;
  taskStatus: string;
  assigneeFullName: string[];
  startDate: string;
  dueDate: string;
  completionRate: number;
}
