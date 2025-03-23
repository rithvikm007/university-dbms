import { Sequelize } from "sequelize";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  dialectModule: pg,
  logging: false,
});

const initModels = async () => {
  const { default: User } = await import("../models/User.js");
  const { default: Student } = await import("../models/Student.js");
  const { default: Faculty } = await import("../models/Faculty.js");

  // Sync the models (don't use force in production, it drops tables every time)
  await sequelize.sync();
  console.log("✅ Tables synced successfully!");
};

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    await initModels(); // Initialize models
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();

export default sequelize;
