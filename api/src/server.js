import express from "express";
import router from "./routes/router.js";
import cors from "cors";
import tasksRepositories from "./repositories/tasks.repositorie.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Vite
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(router);
// Migration leve: garante coluna dataConclusao (streak por dia de conclusão).
tasksRepositories.garantirEstrutura().catch((e) => console.error(e.message));
app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});
