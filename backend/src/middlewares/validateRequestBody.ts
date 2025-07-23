import { NextFunction, Request, Response } from 'express';
import { ZodError, z } from 'zod';

export default function validateRequestBody<T>(schema: z.ZodType<T>) {
  return (req: Request<unknown, unknown, T>, res: Response, next: NextFunction): Response<any, Record<string, any>> | void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
        console.log(req.body);
        console.log(error);
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          path: issue?.path,
          msg: issue.message,
        }));
        return res.status(422).json(errors);
      } else {
        next(error);
      }
    }
  };
}
