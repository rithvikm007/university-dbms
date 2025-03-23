import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const Class = sequelize.define('Class', {
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Courses',
      key: 'course_id',
    },
    primaryKey: true,
  },
  faculty_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Faculties',
      key: 'faculty_id',
    },
    primaryKey: true,
  },
  semester: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
}, {
  tableName: 'Classes',
  timestamps: false,
});

export default Class;