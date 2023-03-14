
const Category = require('../models/category')
const mongoose = require('mongoose');

exports.category_post = (req, res, next) => {
    console.log(req.body.name);
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    category
        .save()
        .then(result => {
            console.log(result)
        })
        .catch(err => console.log(err));
    res.status(500).json({
        message: 'Inserted',
        category: category
    })
}

exports.category_get = (req, res, next) => {
    Category
        .find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.category_update = (req, res, next) => {
    const id = req.params.categoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Category.findByIdAndUpdate({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.category_delete = (req, res, next) => {
    const id = req.params.categoryId
    Category.findByIdAndRemove({
        _id: id
    })
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

