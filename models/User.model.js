const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: 'String',
    lastName: 'String',
    email: {
        type: 'String',
        unique: true
    },
    phone: 'String',
    password: 'String',
    course: 'String',
    address: 'String',
    role: {
        type: 'String',
        enum: ['admin', 'user']
    }
})

module.exports = mongoose.model('User', userSchema);