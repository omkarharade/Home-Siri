import { DataTypes } from "sequelize";
import sequelize from "../config/databases.js";
import User from "./user.js";
import crypto from "crypto";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: "rzp_test_ZEsh3BtedaNCaU", // Replace with your actual Razorpay key
  key_secret: "PIApMOZcNKbj8eElMilQqzxx", // Replace with your Razorpay secret
});

const List = sequelize.define("List", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },

  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  coupon_applied: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "active", // active , scheduled (they will be present below the active list) (ordered List will be present in orders tab)
  },
  schedule_date_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
});

// Establish relationship with User
List.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(List, { foreignKey: 'user_id' }); // If a user can have multiple lists

sequelize
  .sync()
  .then(() => console.log("List table has been created or updated."))
  .catch((err) => console.error("Error creating or updating List table:", err));

export default List;
