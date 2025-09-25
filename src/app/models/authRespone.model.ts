export interface AuthResponseModel {
  token: string;
  refreshToken: string;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
}
