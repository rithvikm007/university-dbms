import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const Department = sequelize.define("Department", {
  department_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hod_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "departments",
  timestamps: false,
});

export default Department;
