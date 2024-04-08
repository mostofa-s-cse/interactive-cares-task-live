const db = require("../../models");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../utils/jwt_token");
const { ErrorLogger } = require("../../utils/logger");

const Order = db.orders;
const User = db.user;

// Create Order
module.exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity, total_price, userId, shipping_address, discounts, order_status, payment_method } = req.body;

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({
        status: "fail",
        message: "User not found",
      });
    }

    // Insert Order in Orders table
    const newOrder = await Order.create({
      productId,
      quantity,
      total_price,
      userId,
      shipping_address,
      discounts,
      order_status,
      payment_method
    });

    res.status(200).send({
      status: "success",
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send({
      status: "fail",
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Get All Orders
module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    if (!orders || orders.length === 0) {
      return res.status(404).send({
        status: "fail",
        message: "Orders not found"
      });
    }

    res.status(200).send({
      status: "success",
      message: "Retrieved all orders",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// Get Single Order
module.exports.getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).send({
        status: "fail",
        message: "Order not found"
      });
    }
    res.status(200).send({
      status: "success",
      message: "Retrieved order successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// Update Order
module.exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity, total_price, userId, shipping_address, discounts, order_status, payment_method } = req.body;

    const updatedOrder = await Order.update({
      productId,
      quantity,
      total_price,
      userId,
      shipping_address,
      discounts,
      order_status,
      payment_method
    }, {
      where: { id: id },
      returning: true,
    });

    if (!updatedOrder) {
      return res.status(404).send({
        status: "fail",
        message: "Order not found",
      });
    }

    res.status(200).send({
      status: "success",
      message: "Order updated successfully",
      data: updatedOrder[1][0],
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to update order",
      error: error.message,
    });
    ErrorLogger.error("updateOrder" + " " + error.message);
  }
};

// Delete Order
module.exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        status: "fail",
        message: "Id not found",
      });
    }

    const deletedCount = await Order.destroy({ where: { id: id } });

    if (!deletedCount) {
      return res.status(404).send({
        status: "fail",
        message: "Order not found",
      });
    }

    res.status(200).send({
      status: "success",
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to delete order",
      error: error.message,
    });
    ErrorLogger.error("deleteOrder" + " " + error.message);
  }
};
