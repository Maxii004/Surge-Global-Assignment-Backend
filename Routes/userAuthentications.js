const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {User} = require('../Models/users');

router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({email:req.body.email});
    if(!user){
        return res.status(400).send("Invalid Email or Password");
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        return res.status(400).send("Invalid Email or Password");
    }

    const token = user.generateAuthToken();
    
    res
        .header("X-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(_.pick(user,["_id", "userName", "email"]));
});


function validate(req) {
    
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(8).max(128).required()
    }).options({ abortEarly: false });

    return schema.validate(req);
}

module.exports = router;