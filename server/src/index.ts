import express from "express";
import cors from "cors";
import { analyzeRouter } from "./routes/analyze";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "LaunchMind-AI server is running." });
});

app.use("/api", analyzeRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
