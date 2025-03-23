import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";
import Student from "./Student.js";
import Course from "./Course.js";

const Enrollment = sequelize.define('Enrollment', {
  user_id: {
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
}, {
  tableName: 'Enrollments',
  timestamps: false,
});

export default Enrollment;
