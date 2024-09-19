export interface IUsersServiceCreate {
  email: string;
  password: string;
  name: string;
  age: number;
}

export interface IUsersServiceFindOneById {
  userId: string;
}

export interface IUsersServiceFindOneByEmail {
  email: string;
}

export interface IUsersServiceUpdateAmount {
  userId: string;
  amount: number;
}

export interface IUsersServiceUpdateAmountByCreate {
  userId: string;
  amount: number;
}
