import { DataTypes } from "sequelize";
import sequelize from "../config/databases.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  have_premium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  premium_expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

sequelize
  .sync()
  .then(() => console.log("User table has been created or updated."))
  .catch((err) => console.error("Error creating or updating user table:", err));

export default User;
