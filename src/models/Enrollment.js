import { DataTypes } from "sequelize";
import sequelize from "@/utils/db"; // Assuming you have a database connection setup
import Student from "./Student";
import Course from "./Course";

const Enrollment = sequelize.define(
  "Enrollment",
  {
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Student,
        key: "student_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Course,
        key: "course_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "enrollments",
    timestamps: false,
  }
);

Enrollment.belongsTo(Student, { foreignKey: "student_id" });
Enrollment.belongsTo(Course, { foreignKey: "course_id" });

export default Enrollment;