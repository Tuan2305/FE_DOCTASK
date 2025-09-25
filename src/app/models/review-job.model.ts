export interface ProgressModel {
  progressId: number;
  status: string;
  updatedBy: number;
  updateByName: string | null;
  proposal: string | null;
  result: string | null;
  feedback: string | null;
  updatedAt: string | null;
  fileName: string | null;
  filePath: string;
}

export interface ScheduledProgressModel {
  periodIndex: number;
  scheduledDate: string;
  progresses: ProgressModel[];
  status: string;
}

export interface UnitProgressModel {
  unitId: number;
  unitName: string;
  scheduledProgresses: ScheduledProgressModel[];
}
export interface UserProgressModel {
  userId: number;
  userName: string;
  scheduledProgresses: ScheduledProgressModel[];
}
