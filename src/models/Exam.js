import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";
import Course from "./Course.js";

const Exam = sequelize.define('Exam', {
  exam_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Course,
      key: 'course_id',
    },
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Midterm', 'Final', 'Quiz'),
    allowNull: false,
  },
}, {
  tableName: 'exams',
  timestamps: false,
});

Exam.belongsTo(Course, { foreignKey: 'course_id' });
Course.hasMany(Exam, { foreignKey: 'course_id' });

export default Exam;