const express = require('express');
const userController = require('../controllers/users.controller');
const router = express.Router();


router.get('/getAll', userController.getAllUsers);
router.get('/userById/:id', userController.findUserById);
router.put('/update/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);


module.exports = router;

