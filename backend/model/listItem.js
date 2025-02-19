import { DataTypes } from "sequelize";
import sequelize from "../config/databases.js";
import List from "./list.js"

const ListItem = sequelize.define("ListItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  list_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: List,
      key: "id",
    },
  },
  product_id: {
    type: DataTypes.STRING,
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
  },
  weight:{
    type:DataTypes.STRING,
    allowNull: true,
  },
  image:{
    type:DataTypes.STRING,
    allowNull:true
  }
}, {
  timestamps: true,
});

// Establish relationship with Cart
ListItem.belongsTo(List, { foreignKey: 'cart_id' });
List.hasMany(ListItem, { foreignKey: 'cart_id' });

sequelize
  .sync()
  .then(() => console.log("CartItem table has been created or updated."))
  .catch((err) => console.error("Error creating or updating cart items table:", err));

export default CartItem;