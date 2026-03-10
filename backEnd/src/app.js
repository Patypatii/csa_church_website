import express from "express";
import cors from "cors";
import authRoute from "./routers/index.js";
import logger from "./logger/winston.js";
import morganMiddleware from "./logger/morgan.js";
import { rateLimit } from "express-rate-limit";
import requestIp from "request-ip";

const app = express();

app.use(cors());
app.use(express.json());


app.use(requestIp.mw());

// Rate limiter to avoid misuse of the service and avoid cost spikes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req, res) => {
    return req.clientIp; // IP address from requestIp.mw(), as opposed to req.ip
  },
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000} minutes`
    );
  },
});

// Apply the rate limiting middleware to all requests
app.use(limiter);



//include versioning to avoid break  the app in feuture adaptation
app.use("/authentication" , authRoute )
// Catch handled rejections normally
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Catch exceptions not in promises
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1); // Exit with failure code
});



app.use(morganMiddleware);

export  {app}