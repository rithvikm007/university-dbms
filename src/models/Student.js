import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";
import User from "./User.js";

const Student = sequelize.define("Student", {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: "user_id",
    },
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  admission_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  graduation_year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Departments",
      key: "department_id",
    },
  },
});


User.hasOne(Student, { foreignKey: "student_id", onDelete: "CASCADE" });
Student.belongsTo(User, { foreignKey: "student_id" });

export default Student;
