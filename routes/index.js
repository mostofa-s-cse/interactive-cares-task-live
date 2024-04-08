const router = require("express").Router();
const user = require("./users");
const orders = require("./orders"); 

router.use("/user", user);
router.use("/orders", orders);

module.exports = router;