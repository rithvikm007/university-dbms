import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

import Department from "./Department.js";

const Course = sequelize.define('Course', {
  course_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  department_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Department,
      key: 'department_id',
    },
    allowNull: false,
  },
}, {
  tableName: 'courses',
  timestamps: false,
});

Department.hasMany(Course, { foreignKey: "department_id", onDelete: "CASCADE" });
Course.belongsTo(Department, { foreignKey: "department_id" });

export default Course;
