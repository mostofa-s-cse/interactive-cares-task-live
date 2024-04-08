const router = require("express").Router();
const user = require("../../controllers/users/users.controller");
const authorization = require("../../utils/authorization");
const { verifyToken } = require("../../utils/verifyToken");

//http://localhost:5000/api/v1/user/signup
router.post("/signup", user.signup);

//http://localhost:5000/api/v1/user/login
router.post("/login", user.login);

//http://localhost:5000/api/v1/user/
router.get("/", verifyToken, authorization("super_admin", "admin","user"), user.getAllUsers);

//http://localhost:5000/api/v1/user/:id
router.get("/:id", verifyToken, authorization("super_admin", "admin","user"), user.getSingleUser);

//http://localhost:5000/api/v1/user/update/:id 
router.put("/:id", verifyToken, authorization("super_admin", "admin","user"), user.updateUser);

// //http://localhost:5000/api/v1/user/delete/:id
router.delete("/:id", verifyToken, authorization("super_admin", "admin","user"), user.deleteUser);

module.exports = router;
