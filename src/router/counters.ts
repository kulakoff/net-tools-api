import { Router } from "express";
import countersController from "../controllers/countersController";
// import authMiddleware from "../middlewares/authMiddleware";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";


export const counterRouter = Router();

counterRouter
    .use(deserializeUser, requireUser)
    .get("/", countersController.getItems)
    .delete("/", countersController.removeItem)
    .get("/:id", countersController.getItem)
    .patch("/:id", countersController.setItem)
    .get("/:id/data", countersController.getItemData)
    .get("/:id/history", countersController.getItemDataHistory)
    .post("/new", countersController.newItem)
    .post("/data", countersController.sendMeters) 
