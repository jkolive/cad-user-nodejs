const express = require('express');
const authController = require('../middlewares/auth')

const router = express.Router();

router.use(authController);

router.get('/', (req, res) => {
    res.send({ ok: true , user: req.userId })
});

module.exports = app => app.use('/projects', router);