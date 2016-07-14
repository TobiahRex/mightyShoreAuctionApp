'use strict';

require('dotenv').load();
const Mail = {
  verify(savedUser, cb) {
    const helper = require('sendgrid').mail;
    const fromEmail = new helper.Email('registration@mightyshore.com');
    const toEmail = new helper.Email(`${savedUser.Email}`);
    const subject = 'Registration Confirmation for Mighty Shore Auctions';
    const content = new helper.Content('text/html',
    `<html>
    <h1>Hi, ${savedUser.Firstname}</h1>
    <br>
    <p>
    Please verify your new account by clicking <a href="${savedUser.profileLink()}">HERE</a>
    </p>
    <br>
    <h2>Thanks!
    <br>
    Respectfully,
    <br>
    <i>Tobiah Rex</i></h2>
    </html>`);
    const mail = new helper.Mail(fromEmail, subject, toEmail, content);
    const sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY);
    const requestBody = mail.toJSON();
    const request = sg.emptyRequest();
    request.method = 'POST';
    request.path = '/v3/mail/send';
    request.body = requestBody;
    sg.API(request, cb);
  },
};
module.exports = Mail;
