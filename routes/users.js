const express = require('express');
const userController = require('../controllers/user');
const auth = require("../auth");
const { verify } = require('../auth');

const router = express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

module.exports = router;