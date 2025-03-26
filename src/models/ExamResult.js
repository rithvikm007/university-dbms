import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const ExamResults = sequelize.define('ExamResults', {
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'students',
      key: 'student_id',
    },
    primaryKey: true,
  },
  exam_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'exams',
      key: 'exam_id',
    },
    primaryKey: true,
  },
  marks: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'examresults',
  timestamps: false,
});

export default ExamResults;