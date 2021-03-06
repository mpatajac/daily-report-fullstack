import { Router } from "express";
import multer from "multer";
import { jwtMiddleware } from "../common/jwt.middleware.js";
import { ReportController } from "../controller/report.controller.js";

const upload = multer();
export const reportRouter = Router();

// const baseRoute = '/';

reportRouter.get(`/`, jwtMiddleware, ReportController.get);
reportRouter.get(`/exists`, jwtMiddleware, ReportController.exists);
reportRouter.get(`/:id`, jwtMiddleware, ReportController.getById);

reportRouter.post(`/`, jwtMiddleware, ReportController.create);
reportRouter.post(
	`/upload`,
	jwtMiddleware, upload.single('report'),
	ReportController.upload
);