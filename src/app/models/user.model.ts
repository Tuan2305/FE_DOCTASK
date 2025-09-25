export interface UserModel {
  userId: number;
  fullName: string;
  email: string;
  orgId: number;

  unitId: number | null;

  userParent: number;
}

export interface UserRelationModel {
  subordinates: UserModel[];
  peers: UserModel[];
}
