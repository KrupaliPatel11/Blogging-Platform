const express = require('express');
const router = express.Router();
const blogController = require('../controller/search_slug')

router.get('/:slug', blogController.blog_search_slug);

module.exports = router