import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgon from "morgan";

import routes from "./routes/index.js";
import { globalRateLimitar } from "./rate-limiters/globalRateLimiter.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgon("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalRateLimitar);

app.use("/api", routes);


export default app;

