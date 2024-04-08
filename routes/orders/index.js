const router = require("express").Router();
const oder = require("../../controllers/orders/orders.controller");
const authorization = require("../../utils/authorization");
const { verifyToken } = require("../../utils/verifyToken");

//http://localhost:5000/api/v1/orders/create
router.post("/create", verifyToken, authorization("super_admin", "admin","user"), oder.createOrder);

//http://localhost:5000/api/v1/orders
router.get("/", verifyToken, authorization("super_admin", "admin","user"), oder.getAllOrders);

//http://localhost:5000/api/v1/orders/:id
router.get("/:id", verifyToken, authorization("super_admin", "admin","user"), oder.getSingleOrder);

//http://localhost:5000/api/v1/orders/update/:id
router.put("/update/:id", verifyToken, authorization("super_admin", "admin","user"), oder.updateOrder);

//http://localhost:5000/api/v1/orders/update/:id
router.patch("/patch/:id", verifyToken, authorization("super_admin", "admin","user"), oder.updateOrder);

// http://localhost:5000/api/v1/orders/delete/:id
router.delete("/delete/:id", verifyToken, authorization("super_admin", "admin","user"), oder.deleteOrder);

module.exports = router;
