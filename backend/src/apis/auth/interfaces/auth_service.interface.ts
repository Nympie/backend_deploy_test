import { IAuthUser, IContext } from 'src/commons/interfaces/context';

export interface IAuthServiceLogin {
  email: string;
  password: string;
  context: IContext;
}

export interface IAuthServiceCreateAccessToken {
  userId: string;
}

// export interface IAuthServiceCreateAccessToken {
//   user: User | IAuthUser['user'];
// }

export interface IAuthServiceRestoreAccessToken {
  user: IAuthUser['user'];
}

export interface IAuthServiceSetRefreshToken {
  userId: string;
  context: IContext;
}
