import express from "express";
import apiRouter from "./routes/api.js";
import connection from "./connection.js";
import dotenv from "dotenv";
import cors from "cors";

const env = dotenv.config().parsed;
var app = express();

app.use(express.json()); // -> MENGIZINKAN SEMUA REQUEST BODY BERUPA JSON
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:8000" }));

app.use("/", apiRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "404_NOT_FOUND",
  });
});
//MongoDB Connection
connection();

app.listen(env.APP_PORT, () => {
  console.log(`SERVER LISTENING ON PORT ${env.APP_PORT}`);
});
