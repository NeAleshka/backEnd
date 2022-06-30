const nodemailer = require('nodemailer')

class MailService {

    constructor() {
        this.transport = nodemailer.createTransport({
            secure: true,
            port:465,
            service:"Yandex",
            auth: {
                user:'alexeybudai@yandex.by',
                pass: "jgauxpiytjgsgtkj"
            }
        })
    }

    async sendVerificationCode(email, verificationCode) {
        await this.transport.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Активация аккаунта Caffesta',
            html:
                ` <div>
              <h1>"Ваш код ${verificationCode}"</h1>
                </div>
                 `
        })
    }
}


module.exports = new MailService()
