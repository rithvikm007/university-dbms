import User from "./User.js";
import Faculty from "./Faculty.js";
import Student from "./Student.js";
import Department from "./Department.js";

Department.belongsTo(Faculty, { foreignKey: "hod_id", as: "hod" });

console.log("✅ Associations initialized successfully!");
