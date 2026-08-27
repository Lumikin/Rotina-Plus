import express from "express";
import router from "./routes/router.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Vite
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(router);
app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});
