const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check_auth');

const blogController = require('../controller/search_slug')

router.get('/:slug', blogController.blog_search_slug);

module.exports = router