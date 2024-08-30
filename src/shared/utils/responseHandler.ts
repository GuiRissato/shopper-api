
import { Response } from 'express';

interface ResponseData {
  success?: boolean;
  error_code?: string;
  error_description?: string;
  [key: string]: any;
}

export const responseHandler = (
  res: Response,
  statusCode: number,
  errorCode: string | null = null,
  errorDescription: string | null = null,
  data: ResponseData = {}
) => {
  if (errorCode && errorDescription) {
    return res.status(statusCode).json({
      error_code: errorCode,
      error_description: errorDescription,
    });
  }

  return res.status(statusCode).json(data);
};