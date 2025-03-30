import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";
import Student from "./Student.js";
import Exam from "./Exam.js";
const ExamResults = sequelize.define('ExamResults', {
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: 'student_id',
    },
    primaryKey: true,
  },
  exam_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Exam,
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

ExamResults.belongsTo(Student, { foreignKey: 'student_id' });
ExamResults.belongsTo(Exam, { foreignKey: 'exam_id' });

Student.hasMany(ExamResults, { foreignKey: 'student_id' });
Exam.hasMany(ExamResults, { foreignKey: 'exam_id' });

export default ExamResults;