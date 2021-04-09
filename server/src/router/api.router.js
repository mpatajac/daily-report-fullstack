import { Router } from "express";
import { userRouter } from "../router/user.router";
import { reportRouter } from "../router/report.router";


export const apiRouter = Router();
apiRouter.use('/users', userRouter);
apiRouter.use('/reports', reportRouter);