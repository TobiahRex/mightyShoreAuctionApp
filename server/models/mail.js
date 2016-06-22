'use strict';

require('dotenv').load();

let Mail = {
  verify(savedUser, cb){
    let helper = require('sendgrid').mail;
    let from_email = new helper.Email("registration@mightyshore.com");
    let to_email = new helper.Email(`${savedUser.Email}`);
    let subject = "Registration Confirmation for Mighty Shore Auctions";
    let content = new helper.Content("text/html", `<html>
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
    let mail = new helper.Mail(from_email, subject, to_email, content);
    var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)
    var requestBody = mail.toJSON()
    var request = sg.emptyRequest()
    request.method = 'POST'
    request.path = '/v3/mail/send'
    request.body = requestBody

    sg.API(request, cb);
  }
};

module.exports = Mail;
