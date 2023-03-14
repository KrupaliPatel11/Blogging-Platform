const mongoose = require('mongoose');
const Blog = require('../models/blog');

let mySlug = title => {
    let slug = title.toLowerCase();
    slug = slug.replace(/ /g, '-');
    slug = slug.replace(/[^\w-]+/g, '');
    return slug;
}

exports.blog_getone = (req, res, next) => {
    Blog.findById(req.params.blogId)
        .exec()
        .then(blog => {
            if (!blog) {
                return res.status(404).json({
                    message: 'Blog not found'
                })
            }
            res.status(200).json({
                blog: blog,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/blog/'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.blog_get = async (req, res, next) => {
    Blog.find({isDeleted: false})
    .populate('category')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            blogs: docs.map(doc => {
                return {
                        _id: doc._id,
                        category: doc.category,
                        title: doc.title,
                        description: doc.description,
                        blogImage: doc.blogImage,
                        slug:  docs.slug,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/blog/' + doc._id
                        }
                    }
                })
            };

            console.log(response);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
}

exports.blog_post = (req, res, next) => {
    let publishedAt = Date()
    console.log(req.file);
    const blog = new Blog({
        _id: new mongoose.Types.ObjectId(),
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        // blogImage: req.file.path,
        publishedAt: publishedAt,
        slug : mySlug(req.body.title),
    });
    blog.save().then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Published Blog successfully',
            createdBlog: {
                _id: result._id,
                category: result.category,
                title: result.title,
                description: result.description,
                publishedAt: publishedAt,
                slug : mySlug(req.body.title),
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/blog/' + result._id
                }
            }
        });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
}

exports.blog_update = (req, res, next) => {
    const id = req.params.blogId;
    const updateOps = {}
    const updatedBy = req.userData.adminId
    const updatedAt = Date();
    const updateTitle = req.body[0].value
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Blog.findOne({_id: id}) 
            .exec()
            .then(result => {
                // console.log(result)
                if(result.isDeleted == true) {
                    return res.status(409).json({
                        message: "Blog cannot be update....It may be deleted!"
                    })
                }
                else {
                    Blog.find({ title : updateTitle }).exec()
                    .then(result => {
                        console.log(result)
                        if(result.length >= 1) {
                            return res.status(409).json({
                                message: "Title is already exists"
                            })
                        } else { Blog.findByIdAndUpdate({ _id: id }, { $set: updateOps, updatedBy, updatedAt })
                        .exec()
                        .then(result =>{
                            // console.log(req.userData.adminId)
                            res.status(200).json({
                                message: 'Blog updated',
                                updatedBy: updatedBy,
                                updatedAt : updatedAt,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/blog/' + id
                                }
                            });
                        })}
                    }) 
                }
            }) 
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.blog_delete = (req, res, next) => {
    let _id = req.params.blogId;
    let deletedBy = req.userData.adminId;
    let deletedAt = Date();
    Blog.findByIdAndUpdate(_id,  { $set: {deletedBy,deletedAt ,isDeleted : true}})
        .exec()
        .then(result => {
            if(result.isDeleted == true) {
                return res.status(409).json({
                    message: 'Blog is already deleted'
                })
            } else
            // console.log(result);
            {
                res.status(200).json({
                _id: req.params.blogId,
                deletedBy : deletedBy,
                deletedAt : deletedAt,
                isdeleted: true,
                message: 'Blog deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/blog',
                }
            });
        }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.blog_search_title = (req, res) => {
    const title = req.query.title
    const regex = new RegExp(title, 'i')
    Blog.findOne({title : regex})
    .exec()
    .then(result => {
     res.status(200).json({
         message : "Search by title",
         result  : result 
     })
    })
 }
