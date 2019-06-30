const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth.json')

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ msg: 'Usuário já cadastrado' });

        const user = await User.create(req.body);
        user.password = undefined;
        return res.send({
            user,
            token: generateToken({ id: user._id }),
        });
    } catch (err) {
        return res.status(400).send("error: " + err);
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user)
        return res.status(400).send('msg: Usuário não encontrado')
    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send('msg: Senha inválida!')

    user.password = undefined;

    res.send({
        user,
        token: generateToken({ id: user._id }),
    });

});

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).send({ msg: 'Usuário não encontrado' });
        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user._id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            from: 'contato@opensourcesolution.com.br',
            to: email,
            subject: 'Test',
            template: 'auth/forgot_password',
            context: { token },
        }), (err) => {
            if (err)
                return res.status(400).send({ msg: 'Não foi possível realizar a recuperação de senha' });
            return res.send('Reset senha enviada');
        }

    } catch (error) {
        res.send({ error: 'Erro ao resetar senha, tente novamente: ' + error });

    }
});

router.post('/reset_password', async (req,res) => {
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({ email })
        .select('+passwordResetToken passwordResetExpires')
   
        if(!user)
        return res.status(400).send({ error: 'Usuário não encotrado'});

        if(token !== user.passwordResetToken)
        return res.status(400).send({ error: 'Token inválido'});

        const now = Date();

        if(now > user.passwordResetExpires )
        return res.status(400).send({ error: 'Token expirado, gere um novo token'});
 
        user.password = password;

        await user.save();

        res.send('sucesso!')

    } catch (error) {
        return res.status(400).send('Não foi possível resetar sua senha, ERRO:' + error );
    }
});

module.exports = app => app.use('/auth', router);