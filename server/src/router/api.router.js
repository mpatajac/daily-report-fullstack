import { Router } from "express";
import { userRouter } from "../router/user.router.js";
import { authRouter } from "../router/auth.router.js";
import { reportRouter } from "../router/report.router.js";


export const apiRouter = Router();
apiRouter.use('/users', userRouter);
apiRouter.use('/login', authRouter);
apiRouter.use('/reports', reportRouter);