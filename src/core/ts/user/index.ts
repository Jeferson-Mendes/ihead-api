export interface IUser {
  id?: string;
  name: string;
  email: string;
}

export enum UserRolesEnum {
  USER = 'User',
  MODERATOR = 'Moderator',
}
