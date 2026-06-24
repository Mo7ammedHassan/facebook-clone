import express from "express";
import globalErrorHandler from "./middlewares/error-handling";
import cookieParser from "cookie-parser";
import authRouter from "./apis/auth/auth.router";
import environment from "./config/environment";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/auth", authRouter);



app.use(globalErrorHandler);

app.listen(environment.PORT, () => {
    console.log(`Server is running on port ${environment.PORT}`);
});