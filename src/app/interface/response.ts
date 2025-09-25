export interface ResponseApi<T = any> {
  success: boolean;
  data: T;
  error?: string;
  message: string;
}
