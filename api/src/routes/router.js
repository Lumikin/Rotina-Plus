import { Router } from "express";
import userRouter from "./users.routes.js";
import authRoutes from "./auth.routes.js";
import tasksRoutes from "./tasks.routes.js";

const router = Router();
router.use("/api/tasks", tasksRoutes);
router.use("/api/users", userRouter);
router.use("/auth", authRoutes);

export default router;