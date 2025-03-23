import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  phone_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_type: {
    type: DataTypes.ENUM('admin', 'faculty', 'student'),
    allowNull: false,
    schema: 'public'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
});

export default User;
