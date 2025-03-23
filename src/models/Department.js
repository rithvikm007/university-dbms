import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";
import Faculty from "./Faculty.js";

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
    references: {
      model: Faculty,
      key: "faculty_id", 
    },
    allowNull: false,
  },
});

Department.hasMany(Faculty, { foreignKey: "department_id", onDelete: "CASCADE" });
Department.belongsTo(Faculty, { foreignKey: "hod_id", as: "hod" });

export default Department;