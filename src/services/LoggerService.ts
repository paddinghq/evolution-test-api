import winston, { Logger }  from 'winston';
import { randomBytes } from 'crypto';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Request, Response } from 'express';


const appVersion: string | undefined = process.env.npm_package_version
const generateLogId = (): string => randomBytes(16).toString('hex')

const timestampFormat = 'MMM-DD-YYYY HH:mm:ss'

// Define a transport to log to a file
const fileTransport = new DailyRotateFile({
  filename: 'logs/%DATE%-app.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '7d',
})

interface HTTPLoggerResponse {
    request: {
      headers: Record<string, string | string[] | undefined>;
      host: string | undefined;
      baseUrl: string | undefined;
      url: string | undefined;
      method: string | undefined;
      body: any | undefined; // Adjust the type as needed
      params: Record<string, any> | undefined;
      query: Record<string, any> | undefined;
      clientIp: string | undefined;
    };
    response: {
      headers: Record<string, string | string[] | undefined>;
      statusCode: number | undefined;
      body: any; // Adjust the type as needed
    };
  }

export const httpLogger: Logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: timestampFormat }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...data }) => {
      const response = {
        level,
        logId: generateLogId(),
        timestamp,
        appInfo: {
          appVersion,
          environment: process.env.NODE_ENV,
          proccessId: process.pid,
        },
        message,
        data,
      }
      return JSON.stringify(response, null, 2) // Adjust the indentation level as needed
    }),
  ),
  transports: [new winston.transports.Console(), fileTransport],
})

const HTTPHeaders = {
  ForwardedFor: 'X-Forwarded-For',
  // Define other headers here if needed
}

const formatHTTPLoggerResponse = (
    req: Request,
    res: Response,
    responseBody: any  // object or array sent with res.send()
) => {
  return {
    request: {
      headers: req.headers,
      host: req.headers.host,
      baseUrl: req.baseUrl,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req?.params,
      query: req?.query,
      clientIp:
        req?.headers[HTTPHeaders.ForwardedFor] ?? req?.socket.remoteAddress,
    },
    response: {
      headers: res.getHeaders(),
      statusCode: res.statusCode,
      body: responseBody,
    },
  }
}

export default formatHTTPLoggerResponse;
