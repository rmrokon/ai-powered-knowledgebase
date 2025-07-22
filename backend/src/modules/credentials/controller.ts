import { Request, Response } from 'express';
import { ICredentialRequestBody, ILoginCredentialRequestBody } from './types';
import { ICredentialService } from './service';

export default class CredentialController {
  _service: ICredentialService;

  constructor(service: ICredentialService) {
    this._service = service;
  }

  createCredential = async (req: Request, res: Response) => {
    const body = req.body as ICredentialRequestBody ;
    const credential = await this._service.createCredential(body);
    return res.status(201).send(credential);
  };

  loginCredential = async (req: Request, res: Response) => {
    const body = req.body as ILoginCredentialRequestBody;
    const result = await this._service.verifyCredential(body);
    return res.status(200).send(result);
  };

  logout = async (req: Request, res: Response) => {
    return res.status(200).send({ message: 'Logged out' });
  };

  getMe = async (req: Request, res: Response) => {
    return res.status(200).send({
        user: req.auth?.user
      });
  };
}
