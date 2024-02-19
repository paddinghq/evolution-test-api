import express, { Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import indexRouter from "./routes/index";
import connectDB from "./config/db";
import { errorHandler, routeNotFound } from "./middlewares/errorHandler";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//= ======== DB Connect ===========
// if (process.env.NODE_ENV === "test") {
//   dbConnect();
// } else {
connectDB();
// }

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);
app.use(express.static(path.join(__dirname, "public")));

// create a write stream (in append mode)
// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// if (process.env.NODE_ENV === 'production') {
//   app.use(morgan('combined', { stream: accessLogStream }))
// } else {
//   app.use(morgan('dev'))
// }

app.get("/", (_req: Request, res: Response) => {
  res.redirect("/api/v1/evolution-api");
});

//= = Root Route ==============
app.use("/api/v1", indexRouter);

// catch 404 and forward to error handler
app.use(routeNotFound);
// app.use((_req: Request, _res: Response, next: NextFunction) => {
//   next(createError(404));
// });

// error handler
app.use(errorHandler);
// app.use((err: HttpError, req: Request, res: Response) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

// // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

export default app;
