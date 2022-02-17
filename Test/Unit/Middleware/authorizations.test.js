const {Users: User} = require('../../../Models/users');
const authorization = require('../../../Middleware/Authorization');
const mongoose=require('mongoose');
const { expectCt } = require('helmet');


describe('auth middleware',() => {
    it('the payload should be populated with a valid JWT',() => {
        const user = {
            _id:mongoose.Types.ObjectId().toHexString(),
        };
        const token = new User(user).generateAuthToken();

        const req = {
            header:jest.fn().mockReturnValue(token)
        };

        const res = {};
        const next = jest.fn();

        authorization(req, res, next);
        expect(req.user).toMatchObject(user);
    });
    
});