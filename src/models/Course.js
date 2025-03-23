import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

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
      model: 'Departments',
      key: 'department_id',
    },
    allowNull: false,
  },
}, {
  tableName: 'Courses',
  timestamps: false,
});

export default Course;
