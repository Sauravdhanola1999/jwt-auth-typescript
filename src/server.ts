import app from "./app.js";
import { connectDB } from "./config/mongodb.js";
import { env } from "./config/env.js";
import { connectRedis } from "./config/redis.js";


const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

startServer();

