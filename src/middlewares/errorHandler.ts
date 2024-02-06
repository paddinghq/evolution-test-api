import { Request, Response, NextFunction } from "express";
import formatHTTPLoggerResponse, {
  httpLogger,
} from "../services/LoggerService";

class HttpError extends Error {
  public status: number;
  public error: Object;
  public code: number; // for mongoose unique constraint errors
  public keyValue: Object; // for mongoose unique constraint errors
  public errors: { [key: string]: any }; // for mongoose validation errors

  constructor(statusCode: number, message: string, error: object = {}) {
    super(message);
    this.name = this.constructor.name;
    this.status = statusCode;
    this.error = error;
    this.code = (error as { code?: number })["code"] || 0;
    this.keyValue = (error as { keyValue?: Object })["keyValue"] || {};
    this.errors =
      (error as { errors?: { [key: string]: any } })["errors"] || {};
  }
}

class BadRequest extends HttpError {
  constructor(message: string, error?: Object) {
    super(400, message, error);
  }
}

class ResourceNotFound extends HttpError {
  constructor(message: string, error?: Object) {
    super(404, message, error);
  }
}

class Unauthorized extends HttpError {
  constructor(message: string, error?: Object) {
    super(401, message, error);
  }
}

class Forbidden extends HttpError {
  constructor(message: string, error?: Object) {
    super(403, message, error);
  }
}

class Conflict extends HttpError {
  constructor(message: string, error?: Object) {
    super(409, message, error);
  }
}

class InvalidInput extends HttpError {
  constructor(message: string, error?: Object) {
    super(422, message, error);
  }
}

class ServerError extends HttpError {
  constructor(message: string, error?: Object) {
    super(500, message, error);
  }
}

const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  const message = `Route not found`;
  res
    .status(404)
    .json({ success: false, message, method: req.method, resource: req.path });
};

const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = err.status || 500;
  let cleanedMessage = (
    statusCode === 500 ? "Internal Server Error" : err.message
  ).replace(/"/g, "");

  const responsePayload: any = {
    success: false,
    message: cleanedMessage,
  };

  if (err instanceof Error) {
    if (err.name === "ValidationError") {
      cleanedMessage = "Validation failed";
      responsePayload.message = err.message;

      try {
        const errorField = Object.keys(err.errors)[0];
        const enumValues = (err.errors as { [key: string]: any })[
          `${errorField}`
        ]["properties"]["enumValues"];
        const invalidValue = (err.errors as { [key: string]: any })[
          `${errorField}`
        ]["properties"]["value"];
        if (enumValues) {
          responsePayload.message = `Invalid ${errorField}: ${invalidValue}. Must be one of [${enumValues.join(
            ", "
          )}]`;
        }
      } catch (e) {
        console.log(e);
      }

      statusCode = 422;
    } else if (err.code && err.code == 11000) {
      cleanedMessage = "Duplicate key error";
      responsePayload.message =
        "This operation could not be completed due to a duplicate entry."; // generic message to avoid leaking sensitive information
      statusCode = 409;
    }
  }

  // Include the error details if available
  if (err.error != null) {
    responsePayload.errors = err.error;
  }

  res.status(statusCode).json(responsePayload);
  console.log(err.message);
  // return httpLogger.error(
  //   cleanedMessage,
  //   formatHTTPLoggerResponse(req, res, { message: `${err}` })
  // );
};

export {
  ServerError,
  Conflict,
  Forbidden,
  Unauthorized,
  ResourceNotFound,
  BadRequest,
  InvalidInput,
  HttpError,
  routeNotFound,
  errorHandler,
};
