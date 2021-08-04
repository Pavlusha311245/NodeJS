const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

router.post('/',
    body('to').isString(),
    body('subject').isString(),
    body('text').isString(),
    body('html').isString(),
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let mail = sendMail(req.body);

    res.status(200).send(mail);
});

module.exports = router;

const sendMail = async (msg) => {
    let transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });
    let info = transport.sendMail({
        from: process.env.MAIL_FROM,
        to: msg.to, // list of receivers
        subject: msg.subject, // Subject line
        text: msg.text, // plain text body
        html: msg.html, // html body
    });
}

const sendToProcessing = (msg) => {
    amqp.connect('amqp://localhost', function (err, conn) {
        conn.createChannel(function (err, ch) {
            const q = 'email';
            ch.assertQueue(q, {durable: true});
            ch.sendToQueue(q, new Buffer(JSON.stringify(msg)), {persistent: true});
            console.log("Message sent to queue : ", msg);
        });
    });
}