import mongoose from "mongoose";
import logger from "../logger/winston.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { removeUnusedMulterImageFilesOnError } from "../utils/index.js";
import multer from "multer";
import  ApiError  from "../utils/ApiError.js";

/**
 *
 * @param {Error | ApiError} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 *
 * @description This middleware is responsible to catch the errors from any request handler wrapped inside the {@link asyncHandler}
 */
    

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Check if the error is an instance of an ApiError class which extends native Error class
  if (!(error instanceof ApiError)) {

   // check if the instance of mongoose error or UploadError which also extend the native error class
    // create a new ApiError instance to keep the consistency
    //error.status code comes form errors that have the status code , err,code comes from multe error since they are not numbers but they are strings e.g LIMIT_EXCEDED , else the rest will be either 400 or 500
    const statusCode = error.statusCode || err.code  || error instanceof mongoose.Error  || err instanceof UploadError? 400 :  500 ;
    // const statusCode = error.statusCode || 500 ;

    // check if the instance of multer error
    if (err instanceof multer.MulterError){
       let friendlyMessage = "multer error";
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          friendlyMessage = "File too large. Max size is 10MB.";
          break;
        case "LIMIT_FILE_COUNT":
          friendlyMessage = "Too many files uploaded.";
          break;
        case "LIMIT_UNEXPECTED_FILE":
               friendlyMessage = `Unexpected file field: ${err.field}. Allowed fields are 'file' or 'files'.`;
          break;
        default:
           error.message = friendlyMessage ;
    }
  }
    // assign an appropriate status code
    // set a message from native Error instance or a custom one
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Now we are sure that the `error` variable will be an instance of ApiError class
  const response = {...error , message: error.message, ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),// Error stack traces should be visible in development for debugging
  };

  logger.error(`${error.message}`);

  removeUnusedMulterImageFilesOnError(req);
  // Send error response
  return res.status(error.statusCode).json(response);
};

export { errorHandler }
