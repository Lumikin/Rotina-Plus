import { Router } from "express";
import userRouter from "./users.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/users", userRouter);
router.use("/auth", authRoutes);

export default router;
