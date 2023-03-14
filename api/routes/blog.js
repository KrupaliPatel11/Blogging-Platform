const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check_auth');
const multer = require('multer');

const storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + " " + file.originalname)
    }
})

const upload = multer({storage: storage});

const blogController = require('../controller/blog')

router.get('/', blogController.blog_get );
router.post('/',upload.single('blogImage'), blogController.blog_post );
router.get('/search', blogController.blog_search_title)
router.get('/:blogId', blogController.blog_getone );
router.patch('/:blogId',checkAuth, blogController.blog_update );
router.delete('/:blogId',checkAuth, blogController.blog_delete);

module.exports = router
