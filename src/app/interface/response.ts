export interface ResponseApi<T = any> {
  success: boolean;
  data: T | null;
  error?: string;
  message: string;
}
