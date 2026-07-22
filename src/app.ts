import express from "express";
import globalErrorHandler from "./middlewares/error-handling";
import cookieParser from "cookie-parser";
import authRouter from "./apis/auth/auth.router";
import environment from "./config/environment";
import postRouter from "./apis/posts/post.route";
import multer from "multer";
import groupRouter from "./apis/group/router";

const app = express();

app.use(express.json());

// app.use(express.urlencoded({ extended: true }));

// app.use(multer);
app.use(cookieParser());

app.use("/auth", authRouter);

app.use("/post", postRouter);

app.use("/group",groupRouter);

app.use(globalErrorHandler);

app.listen(environment.PORT, () => {
    console.log(`Server is running on port ${environment.PORT}`);
});