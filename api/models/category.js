const mongoose = require('mongoose');

const cateSchema = mongoose.Schema({
    _id :  mongoose.Types.ObjectId,
    name : {type: String}
})

module.exports = mongoose.model('Category',cateSchema);