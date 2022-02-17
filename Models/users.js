const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        minlength: 8,
        maxlength: 40
    },
    userName:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 10
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ 
        _id: this._id, 
        userName: this.userName,
        email: this.email,
    }, 
    config.get('jwtPrivateKey'));
    return token;
}

const user = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        fullName: Joi.string().min(8).max(40).required(),
        userName: Joi.string().min(6).max(10).required(),
        email: Joi.string().required(),
        password: Joi.string().min(8).max(128).required(),
    }).options({ abortEarly: false });
    return schema.validate(user);
}

exports.User = user;
exports.validate = validateUser;