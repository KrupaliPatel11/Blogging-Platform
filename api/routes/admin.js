const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check_auth');

const adminController = require('../controller/admin');

router.post('/signup', adminController.admin_signup);
router.post('/login', adminController.admin_login);
router.delete('/:adminId',checkAuth, adminController.admin_delete);
router.post('/logout',checkAuth,adminController.admin_logout);

module.exports = router;