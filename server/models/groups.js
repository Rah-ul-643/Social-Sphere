const mongoose = require('mongoose');

const groupsSchema = new mongoose.Schema({
    group_id : {
        type: String,
        required: true
    },

    group_name: String,

    admin: {
        type: String,
        ref: 'users'
    },

    participants : [{
        type: String,
        ref: 'users'
    }],

    messages : [{
        type: mongoose.Types.ObjectId,
        ref: 'messages',
        default: []
    }],

    join_requests : [{
        type: String,
        ref: 'users',
        default: []
    }]

}, { timestamps: true }
)

module.exports = mongoose.model('groups', groupsSchema);