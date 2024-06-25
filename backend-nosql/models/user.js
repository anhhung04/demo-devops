const { name } = require('ejs');
const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;