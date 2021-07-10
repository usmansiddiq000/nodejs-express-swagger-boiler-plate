var mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jhonblack.freefall@gmail.com",
    pass: "Password@54321",
  },
});
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
/**
 * 
    nodemailer will be replace by mailgun
 */

exports.sendEmail = async (
  name,
  data,
  subject,
  physiciansEmails,
  adminEmail
) => {
  const template = ejs.compile(
    fs.readFileSync(
      path.join(__dirname + "/../email-templates") + `/${name}.html`,
      "utf8"
    )
  );
  const html = template({ data });

  const mailOptions = {
    from: adminEmail,
    to: physiciansEmails,
    subject: subject,
    html: html,
    //'recipient-variables': '{"alice@example.com": {"first":"Alice", "id":1}, "bob@example.com":{"first":"Bob", "id":2}}'
  };

  return transporter.sendMail(mailOptions);
  // return mailgun.messages().send(mailOptions); // we need this, for mailgun
};
