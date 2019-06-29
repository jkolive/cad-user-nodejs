const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req,res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
    return res.status(401).send({ msg: 'Token não informado'});

    const parts = authHeader.split(' ');

    if(!parts.lenght === 2)
    return res.status(401).send({ error: 'Token com erro'});

    const [ scheme, token ] = parts;

    if(!/^Token$/i.test(scheme))
    return res.status(401).send({ msg: 'Formato incorreto do token'});

    jwt.verify(token, authConfig.secret, (err, decoded) =>{
      if(err) 
        return res.status(401).send({ msg: 'Toke inválido!'}); 
        req.userId = decoded.id;
        return next();
    })
};