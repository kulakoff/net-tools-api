import { Router } from "express";
import countersController from "../controllers/countersController";
import authMiddleware from "../middlewares/authMiddleware";

export const counterRouter = Router();

counterRouter.use(authMiddleware)
counterRouter
    .get("/", countersController.getItems)
    .patch("/:id", countersController.setItem)
    .get("/:id", countersController.getItem)
    .post("/new", countersController.newItem)
    .delete("/", countersController.removeItem)
    .post("/data", countersController.sendMeters) // Отправка показаний приборов учета
    .get("/:id/data",
        countersController.getItemData
    )//Просмотр показаний по выбранного прибора учета
    .get("/:id/history",
        countersController.getItemDataHistory
    ) //Вывод истории показаний прибора учета
