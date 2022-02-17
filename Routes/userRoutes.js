const { User, validate } = require('../Models/users');
const mongoose = require('mongoose');
const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const validateObjectId = require('../Middleware/ValidateObjectId');
const authorization = require('../Middleware/Authorization');

router.get('/',async(req, res) => {
    const user = await User
        .find()
        .select('-password')
        .select('-__v')
        .sort('fullName');
    res.send(user);
});

router.post('/signup', async(req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).send("This email already exists");
    }
    
    let username = await User.findOne({userName:req.body.userName});
    if(username){
        return res.status(400).send("This username is taken");
    }

    user = new User({
        fullName: req.body.fullName,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
        user = await user.save();
        res.send(user);
    } catch (ex) {
        console.log(ex.message);
    }
});

router.put('/updatefullname/:id', authorization, async(req, res) => {
    const {error} = validateUserFullNamePut(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).send("This email already exists");
    }
    
    let username = await User.findOne({userName:req.body.userName});
    if(username){
        return res.status(400).send("This username is taken");
    }

    // const salt = await bcrypt.genSalt(10);
    // newPassword = await bcrypt.hash(req.body.password, salt);

    const userUpdate = await User.findByIdAndUpdate(
        req.params.id,
        {
            fullName: req.body.fullName,
            // password: newPassword
        },
        {
            new: true
        }
    );

    if(!userUpdate){
        return res.status(400).send("Invalid User");
    }

    res
        .send(userUpdate)
        .select('-password')
        .select('-__v');


});

router.put('/updatepassword/:id', authorization, async(req, res) => {
    const {error} = validateUserPasswordPut(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).send("This email already exists");
    }
    
    let username = await User.findOne({userName:req.body.userName});
    if(username){
        return res.status(400).send("This username is taken");
    }

    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(req.body.password, salt);

    const userUpdate = await User.findByIdAndUpdate(
        req.params.id,
        {
            // fullName: req.body.fullName,
            password: newPassword
        },
        {
            new: true
        }
    );

    if(!userUpdate){
        return res.status(400).send("Invalid User");
    }

    res
        .send(userUpdate)
        .select('-password')
        .select('-__v');


});


router.get('/:id', validateObjectId, async(req,res) => {
    const user = await User
        .findById(req.params.id)
        .select('-password')
        .select('-__v');
    if (!user) {
        return res.status(404).send('This user does not exist');
    }
    res.send(user);
})

function validateUserPasswordPut(req) {
    const schema = Joi.object({
        // fullName: Joi.string().min(8).max(40).required(),
        password: Joi.string().min(8).max(128).required()
    }).options({ abortEarly: false });
    return schema.validate(req);
}

function validateUserFullNamePut(req) {
    const schema = Joi.object({
        fullName: Joi.string().min(8).max(40).required()
        // password: Joi.string().min(8).max(128).required()
    }).options({ abortEarly: false });
    return schema.validate(req);
}


module.exports = router;