"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const analyze_1 = require("./routes/analyze");
const slack_1 = require("./routes/slack");
const drive_1 = require("./routes/drive");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "LaunchMind-AI server is running." });
});
app.use("/api", analyze_1.analyzeRouter);
app.use("/api", slack_1.slackRouter);
app.use("/api", drive_1.driveRouter);
const clientDistPath = path_1.default.join(__dirname, "../../client/dist");
app.use(express_1.default.static(clientDistPath));
app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path_1.default.join(clientDistPath, "index.html"));
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
