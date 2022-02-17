const {User} = require('../../../Models/users');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const { expectCt } = require('helmet');

describe('user.generateAuthToken',()=>{

    it('a valid jwt should be returned',() =>{

        const payload = {
            _id:new mongoose.Types.ObjectId().toHexString()
        };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload);
    });
});