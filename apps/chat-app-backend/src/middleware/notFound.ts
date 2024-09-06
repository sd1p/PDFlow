import { Response, Request, NextFunction } from "express";
import { CustomError } from "../lib/customError";

export function notFound(req: Request, res: Response, next: NextFunction) {
  return next(new CustomError("Route not found", 404));
}
