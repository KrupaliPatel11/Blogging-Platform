const mongoose = require('mongoose');
const Blog = require('../models/blog');
const Admin = require('../models/admin');

exports.blog_search_slug  = (req, res) => {
    const slug = req.params.slug;
    Blog.findOne({slug : slug, isDeleted : false})
    .populate('category')
    .exec()
    .then(result => 
        {
            console.log("Search blog using slug")
            res.status(200).json(result)
        }
        )
}