const express = require('express');

const userController = require("../controllers/users.controller")
const { requireAuth, authorize } = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");


const router = express.Router();
// TODO: Add user routes here
// Example:
router.post('/',[requireAuth,authorize("Manager")], asyncHandler(userController.addUserByManager));
// router.get('/', userController.getAllUsers);
// router.get('/:id', userController.getUserById);
// router.put('/:id', userController.updateUser);

const userController = require('../controllers/users.controller');
const router = express.Router();


router.get('/getAll', userController.getAllUsers);
router.get('/userById/:id', userController.findUserById);
router.put('/update/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);



module.exports = router;

