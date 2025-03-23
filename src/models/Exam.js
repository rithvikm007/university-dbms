import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const Exam = sequelize.define('Exam', {
  exam_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Courses',
      key: 'course_id',
    },
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('midterm', 'final'),
    allowNull: false,
  },
}, {
  tableName: 'Exams',
  timestamps: false,
});

export default Exam;