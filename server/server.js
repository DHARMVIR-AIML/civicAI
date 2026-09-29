const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const https = require("https");
const fs = require("fs");


require("dotenv").config();

const app = express();
console.log(
    "OPENAI KEY LOADED:",
    process.env.OPENAI_API_KEY
        ? "YES"
        : "NO"
);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const suggestionRoutes = require("./routes/suggestionRoutes");
app.use("/api/suggestions", suggestionRoutes);

const complaintRoutes = require("./routes/complaintRoutes");
app.use("/api/complaints", complaintRoutes);

const budgetRoutes = require("./routes/budgetRoutes");
app.use("/api/budget", budgetRoutes);

const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);

const areaDataRoutes = require("./routes/areaDataRoutes");
app.use("/api/area-data", areaDataRoutes);

const dataFusionRoutes = require("./routes/dataFusionRoutes");
app.use("/api/data-fusion", dataFusionRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "..", "index.html"));
});

const PORT = process.env.PORT || 5000;

https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname, "..", "10.65.152.42+1-key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "..", "10.65.152.42+1.pem"))
    },
    app
).listen(PORT, "0.0.0.0", () => {
    console.log(`HTTPS Server running on https://10.65.152.42:${PORT}`);
});