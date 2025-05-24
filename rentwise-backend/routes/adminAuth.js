const express = require('express');
const { adminLogin } = require('../controllers/adminAuthController');
const router = express.Router();


router.post('/', adminLogin);

module.exports = router;