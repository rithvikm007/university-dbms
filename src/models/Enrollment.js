import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";
import Student from "./Student.js";
import Course from "./Course.js";

const Enrollment = sequelize.define('Enrollment', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "students",
      key: 'student_id',
    },
    primaryKey: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "courses",
      key: 'course_id',
    },
    primaryKey: true,
  },
}, {
  tableName: 'enrollments',
  timestamps: false,
});

export default Enrollment;
