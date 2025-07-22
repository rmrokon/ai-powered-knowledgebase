import { Router } from 'express';
import {
  isAuthenticated,
  validateRequestBody,
} from '../../middlewares';
import { credentialController } from '../bootstrap';
import {
  CredentialBodyValidationSchema,
  LoginCredentialBodyValidationSchema,
} from './validation';
import { asyncHandler } from '../../middlewares/errorHandlers';

export const CredentialRouter = Router();

CredentialRouter.route('/').post(
  [validateRequestBody(CredentialBodyValidationSchema)],
  asyncHandler(credentialController.createCredential),
);

CredentialRouter.route('/login').post(
  [validateRequestBody(LoginCredentialBodyValidationSchema)],
  asyncHandler(credentialController.loginCredential),
);

CredentialRouter.route('/me')
  .get([isAuthenticated], asyncHandler(credentialController.getMe))
  .delete([isAuthenticated], asyncHandler(credentialController.logout));
