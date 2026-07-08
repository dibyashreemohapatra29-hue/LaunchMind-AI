import path from "path";
import express from "express";
import cors from "cors";
import { analyzeRouter } from "./routes/analyze";
import { slackRouter } from "./routes/slack";
import { driveRouter } from "./routes/drive";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "LaunchMind-AI server is running." });
});

app.use("/api", analyzeRouter);
app.use("/api", slackRouter);
app.use("/api", driveRouter);

const clientDistPath = path.join(__dirname, "../../client/dist");
app.use(express.static(clientDistPath));

app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
