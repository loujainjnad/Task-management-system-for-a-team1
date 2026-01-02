const {body,param} = require("express-validator");
const User = require('../models/User');

const findUserById = [
    param("id")
    .isString().withMessage("Id must be string").bail()
    .isMongoId().withMessage("Invalid Id Format")
];
const updateUser = [
    body("name")
        .isString().withMessage("Name must be string").bail()
        .isLength({min: 3 , max: 50 }).withMessage("Title length must be in (3 - 50) range").bail(),

    body("role")
        
]

module.exports = {
    findUserById,
}