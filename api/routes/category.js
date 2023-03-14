const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check_auth');

const Category = require('../models/category');

const cateController = require('../controller/category')

router.post('/',checkAuth, cateController.category_post);
router.get('/', cateController.category_get );
router.patch('/:categoryId',checkAuth ,cateController.category_update);
router.delete('/:categoryId' ,checkAuth, cateController.category_delete);

module.exports = router
