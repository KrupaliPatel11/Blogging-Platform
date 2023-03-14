const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    email: {
        type: String,
        required : true,
        unique : true,
        match: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/
    },
    password: {
        type : String,
        required : true
    },
    token : {
        type: String,
    }
})

module.exports = mongoose.model('Admin', adminSchema);