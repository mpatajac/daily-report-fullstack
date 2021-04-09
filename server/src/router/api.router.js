import { Router } from "express";
import { userRouter } from "../router/user.router";
import { authRouter } from "../router/auth.router";
import { reportRouter } from "../router/report.router";


export const apiRouter = Router();
apiRouter.use('/users', userRouter);
apiRouter.use('/login', authRouter);
apiRouter.use('/reports', reportRouter);