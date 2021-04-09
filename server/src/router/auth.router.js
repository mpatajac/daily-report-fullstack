import { Router } from "express";
import { jwtMiddleware } from "../common/jwt.middleware.js";
import { UserController } from '../controller/user.controller.js';

export const authRouter = Router();

// const baseRoute = '/';

authRouter.post(`/`, UserController.login);

authRouter.delete(`/`, jwtMiddleware, UserController.logout);