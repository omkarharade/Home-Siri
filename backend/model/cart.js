import { DataTypes } from "sequelize";
import sequelize from "../config/databases.js";
import User from "./user.js";

const Cart = sequelize.define("Cart", {
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
  status: {
    type: DataTypes.STRING,
    defaultValue: "active", // active or checked_out
  }
}, {
  timestamps: true,
});

// Establish relationship with User
Cart.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Cart, { foreignKey: 'user_id' });

sequelize
  .sync()
  .then(() => console.log("Cart table has been created or updated."))
  .catch((err) => console.error("Error creating or updating cart table:", err));

export default Cart;