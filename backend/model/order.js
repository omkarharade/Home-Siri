import { DataTypes } from "sequelize";
import sequelize from "../config/databases.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Referencing User model
        key: "id",
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending", // Pending, completed, canceled, etc.
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coupon_applied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

sequelize
  .sync()
  .then(() => console.log("Order table has been created or updated."))
  .catch((err) => console.error("Error creating or updating order table:", err));

export default Order;
