import { Request, Response } from 'express';

export interface IAuthUser {
  user?: { id: string };
}

export interface IContext {
  request: Request & IAuthUser;
  response: Response;
}
