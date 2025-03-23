import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";
import User from "./User.js";

const Faculty = sequelize.define("Faculty", {
  facuilty_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: "user_id",
    },
    allowNull: false,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Departments",
      key: "department_id",
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasOne(Faculty, { foreignKey: "facuilty_id", onDelete: "CASCADE" });
Faculty.belongsTo(User, { foreignKey: "facuilty_id" });

export default Faculty;
