import { FrequencyType } from '../constants/util';

export interface KyThoiGian {
  id: number;
  ten_ky: string;
  StartDate: string;
  EndDate: string;
  FrequencyType: FrequencyType;
  Frequency: number;
  CreatedAt: string;
  UpdatedAt: string;
}
