import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";
import Course from "./Course.js";
import Faculty from "./Faculty.js";

const Class = sequelize.define('Class', {
  course_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Course,
      key: 'course_id',
    },
    primaryKey: true,
  },
  faculty_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Faculty,
      key: 'faculty_id',
    },
    primaryKey: true,
  },
}, {
  tableName: 'classes',
  timestamps: false,
});

Class.belongsTo(Course, { foreignKey: 'course_id' });
Class.belongsTo(Faculty, { foreignKey: 'faculty_id' });

Course.hasMany(Class, { foreignKey: 'course_id' });
Faculty.hasMany(Class, { foreignKey: 'faculty_id' });

export default Class;