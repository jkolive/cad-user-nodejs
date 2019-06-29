const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    const { email } = req.body;
    
    try {
        if(await User.findOne({email}))
        return res.status(400).send({ msg: 'Usuário já cadastrado'});
        
        const user = await User.create(req.body);
        user.password = undefined;
        return res.send({ user });
    } catch (err) {
        return res.status(400).send("error: " + err);
    }
});

module.exports = app => app.use('/auth', router);