const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    
    sender: { 
        type: String, 
        ref: 'users' 
    },

    read_receipt: Boolean,

    message:  String ,

}, { timestamps: true }
);


module.exports = mongoose.model('messages', messageSchema);