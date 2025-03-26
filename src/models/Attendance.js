import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const Attendance = sequelize.define('Attendance', {
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'students',
      key: 'student_id',
    },
    primaryKey: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'courses',
      key: 'course_id',
    },
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATE,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('Absent', 'Present'),
    defaultValue: 'Absent',
  },
}, {
  tableName: 'attendances',
  timestamps: false,
});

export default Attendance;