import { Request, Response, NextFunction } from "express";
import AppError from "../utils/app-error";
// استدعاء الـ Prisma للوصول لـ أخطاء الـ Classes الرسمية في إصدار 7
import { Prisma } from "../../generated/prisma/client"; 

/* =========================
   Prisma Error Handlers
   ========================= */

const handlePrismaDuplicateError = (err: Prisma.PrismaClientKnownRequestError): AppError => {
  const fields = Array.isArray(err.meta?.target)
    ? err.meta.target.join(", ")
    : "field";

  return new AppError(`Duplicate field value: ${fields}. Please use another value.`, 400);
};

const handlePrismaNotFoundError = (): AppError => {
  return new AppError("No record found with the given identifier.", 404);
};

const handlePrismaForeignKeyError = (): AppError => {
  return new AppError("Invalid reference to a related record (Foreign key constraint failed).", 400);
};

const handlePrismaValidationError = (err: Prisma.PrismaClientValidationError): AppError => {
  // بنبسط المسج لليوزر في الـ Prod عشان ميسربش الـ Schema internals
  return new AppError("Invalid input data type or missing required fields based on database schema.", 400);
};

const handlePrismaInitializationError = (): AppError => {
  return new AppError("Database connection failed. Please try again later.", 500);
};

/* =========================
   Web & Express Error Handlers
   ========================= */

const handleJWTError = (): AppError => new AppError("Invalid token. Please log in again.", 401);
const handleJWTExpiredError = (): AppError => new AppError("Your token has expired! Please log in again.", 401);
const handleExpressJSONError = (): AppError => new AppError("Invalid JSON format in request body.", 400);

/* =========================
   Response Helpers
   ========================= */

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // خطأ برمجى (Programming or unknown error): مش عايزين نسرب تفاصيل الكود للهاكرز
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong on our side!",
    });
  }
};

/* =========================
   Global Error Handler
   ========================= */

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.MODE_ENV === "dev") {
    sendErrorDev(err, res);
    return;
  }

  // في الـ Production بنبدأ نعمل الهندسة الصافية وتحديد نوع الخطأ غصب عن السيستم
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else {
    // قيمة افتراضية لو ملقطناش نوع الخطأ تحت
    error = new AppError(err.message || "Something went wrong", err.statusCode);
    error.isOperational = false; // افتراضياً مش مجهز حتى نثبت العكس
  }

  // 1. صيد أخطاء الـ Express native (مثل الـ Body Parser JSON Error)
  if (err.status === 400 && "body" in err) {
    error = handleExpressJSONError();
  }

  // 2. صيد أخطاء الـ JWT الشاملة
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  // 3. صيد أخطاء بريزما 7 الرسمية بالـ Instance الحقيقي
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        error = handlePrismaDuplicateError(err);
        break;
      case "P2025":
        error = handlePrismaNotFoundError();
        break;
      case "P2003":
        error = handlePrismaForeignKeyError();
        break;
      default:
        error = new AppError(`Database operation failed (Code: ${err.code})`, 400);
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    error = handlePrismaValidationError(err);
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    error = handlePrismaInitializationError();
  }

  // تمرير الخطأ المهندل النضيف للـ Response للفرونت إند
  sendErrorProd(error, res);
};

export default globalErrorHandler;