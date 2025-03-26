import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";
import User from "./User.js";
import Department from "./Department.js"; // ✅ Add Department here

const Faculty = sequelize.define(
  "Faculty",
  {
    faculty_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: "user_id",
      },
      allowNull: false,
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Department,
        key: "department_id",
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "faculties",
    timestamps: false,
  }
);

User.hasOne(Faculty, { foreignKey: "faculty_id", onDelete: "CASCADE" });
Faculty.belongsTo(User, { foreignKey: "faculty_id" });

Department.hasMany(Faculty, { foreignKey: "department_id", onDelete: "CASCADE" });
Faculty.belongsTo(Department, { foreignKey: "department_id" });

export default Faculty;