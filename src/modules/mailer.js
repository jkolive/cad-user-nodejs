const path = require('path');
const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
//import { host, port, user, pass } from '../config/mail.json';
const { host, port, user, pass } = require('../config/mail.json');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass
    },
}); 

transport.use('compile', hbs({
    viewEngine: {
        partialsDir: path.resolve('./src/resources/mail/'),
        layoutsDir: path.resolve('./src/resources/mail/auth'),
        defaultLayout: 'forgot_password',
        extName: '.html',
      },
      viewPath: path.resolve('./src/resources/mail/'),
      extName: '.html',
}));

module.exports = transport;