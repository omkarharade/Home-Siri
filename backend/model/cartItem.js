import { DataTypes } from "sequelize";
import sequelize from "../config/databases.js";
import Cart from "./cart.js";

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cart,
      key: "id",
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, {
  timestamps: true,
});

// Establish relationship with Cart
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });
Cart.hasMany(CartItem, { foreignKey: 'cart_id' });

sequelize
  .sync()
  .then(() => console.log("CartItem table has been created or updated."))
  .catch((err) => console.error("Error creating or updating cart items table:", err));

export default CartItem;