import { Router } from "express";
import { jwtMiddleware } from "../common/jwt.middleware";
import { UserController } from '../controller/user.controller.js';

export const userRouter = Router();

const baseRoute = `/:username`;

userRouter.get(`${baseRoute}`, jwtMiddleware, UserController.get);
userRouter.get(`${baseRoute}/exists`, UserController.exists);

userRouter.put(`${baseRoute}/`, jwtMiddleware, UserController.update);
userRouter.put(`${baseRoute}/password`, jwtMiddleware, UserController.changePassword);