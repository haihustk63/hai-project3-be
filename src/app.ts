import dotenv from "dotenv";
import express, { Application } from "express";
import { createServer } from "http";

import { dbConnect } from "./config/db";
import { initialSocker } from "./config/socket";
import deviceRoute from "./routes/device";
import ruleRoute from "./routes/rule";
import userRoute from "./routes/user";
import sensorRoute from "./routes/sensor";

const app: Application = express();

dotenv.config();

const PORT = process.env.APP_PORT || 7220;

dbConnect();

app.use(express.json());

app.use(userRoute);
app.use(deviceRoute);
app.use(ruleRoute);
app.use(sensorRoute);

const httpServer = createServer(app);

initialSocker(httpServer);

httpServer.listen(PORT, () => {
  console.log("App is listening on port ", PORT);
});
