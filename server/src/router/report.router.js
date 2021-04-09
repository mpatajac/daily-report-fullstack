import { Router } from "express";
import { jwtMiddleware } from "../common/jwt.middleware.js";
import { ReportController } from "../controller/report.controller.js";


export const reportRouter = Router();

// const baseRoute = '/';

reportRouter.get(`/`, jwtMiddleware, ReportController.get);
reportRouter.get(`/:id`, jwtMiddleware, ReportController.getById);

reportRouter.post(`/`, jwtMiddleware, ReportController.create);
reportRouter.post(`/upload`, jwtMiddleware, ReportController.upload);