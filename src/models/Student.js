import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";
import User from "./User.js";
import Department from "./Department.js";

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
      model: "departments",
      key: "department_id",
    },
  },
},{
  tableName: "students",
  timestamps: false,
});


User.hasOne(Student, { foreignKey: "student_id", onDelete: "CASCADE" });
Student.belongsTo(User, { foreignKey: "student_id" });

Department.hasMany(Student, { foreignKey: "department_id", onDelete: "CASCADE" });
Student.belongsTo(Department, { foreignKey: "department_id" });

export default Student;