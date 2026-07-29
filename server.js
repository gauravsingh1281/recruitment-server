import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

import app from "./src/app.js";

import config from "./src/config/environment.js";
import { connectRedis } from "./src/config/redis.js";
import { connectDB } from "./src/config/database.js";
import logger from "./src/utils/logger.js";
import "./src/workers/emailWorker.js";

// THIS LINE STARTS THE BULLMQ WORKER AUTOMATICALLY
import "./src/workers/emailWorker.js";  // ← JUST THIS ONE LINE
import jobApplicationModel from "./src/models/jobApplication.model.js";
import userModel from "./src/models/user.model.js";

const { PORT } = config;

async function startServer() {
  try {
    await connectDB();
    logger.info("MongoDB connected successfully");

    await connectRedis();
    logger.info("Redis connected successfully");


    app.listen(PORT, () => {
      logger.info(`Server + BullMQ Worker running on http://localhost:${PORT}`);
      logger.info(`Admin panel (optional): http://localhost:${PORT}/admin/queues`);
    });
  } catch (error) {
    logger.error("Server failed to start:", error);
    process.exit(1);
  }
}

startServer();




