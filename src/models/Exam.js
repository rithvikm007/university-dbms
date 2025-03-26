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
      model: 'courses',
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
  tableName: 'exams',
  timestamps: false,
});

export default Exam;