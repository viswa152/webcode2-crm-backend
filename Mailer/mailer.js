const nodemailer = require("nodemailer")
require('dotenv').config()
const mailFunction = async (requirdOptions) => {
    const { usermail, mailsubject, mailcontent } = requirdOptions;
    try {
        let sender = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        let mailoptions = {
            from: process.env.EMAIL,
            to: usermail,
            subject: mailsubject,
            text: mailcontent,
        }
        const mailResult = await sender.sendMail(mailoptions);
        return mailResult;
    } catch (error) {
        console.log(error.message, "error in node mailer")
    }

};
module.exports = mailFunction;