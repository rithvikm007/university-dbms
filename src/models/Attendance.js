import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";
import Student from "./Student.js";
import Course from "./Course.js";

const Attendance = sequelize.define('Attendance', {
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: 'student_id',
    },
    primaryKey: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Course,
      key: 'course_id',
    },
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATE,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('Absent', 'Present', 'Late'),
    defaultValue: 'Absent',
  },
}, {
  tableName: 'attendance',
  timestamps: false,
});

Attendance.belongsTo(Student, { foreignKey: 'student_id' });
Attendance.belongsTo(Course, { foreignKey: 'course_id' });

export default Attendance;