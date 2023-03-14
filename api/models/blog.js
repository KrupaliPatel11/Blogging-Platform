
const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    _id : mongoose.Types.ObjectId,

    category : {type: String},

    title: { type: String,unique: true},

    description: {type : String,required : true},

    blogImage : {type: String},

    slug: { type: String},

    updatedAt : {type: Date},

    updatedBy: {type: String},

    deletedAt : {type: Date,default : null},

    deletedBy : {type: String,default: null},

    publishedAt : {type: Date},

    isDeleted : {type: Boolean, default: false},

}, {versionKey : false})

module.exports = mongoose.model('Blog', blogSchema);
