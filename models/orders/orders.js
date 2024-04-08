const validator = require("validator");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes, Sequelize) => {
  const orders = sequelize.define(
    "orders",
    {
      id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER(30),
        allowNull: false,
        required: [true, "User Id required"],
      },
      productId: {
        type: DataTypes.INTEGER(30),
        allowNull: false,
        required: [true, "Product Id is required"],
      },
      quantity: {
        type: DataTypes.INTEGER(30),
        allowNull: false,
        required: [true, "Quantity is required"],
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
      shipping_address: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      discounts: {
        type: DataTypes.INTEGER(30),
        allowNull: true,
      },
      order_status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      payment_method: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
  );
  orders.associate = function(models) {
    orders.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
  };  
  return orders;
};
