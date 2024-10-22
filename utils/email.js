const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
// const { options } = require('../routes/tourRoutes');

module.exports = class Email{
    constructor(user, url){
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Avanit Rangadiya <${process.env.EMAIL_FROM}>`
    }

    newTransport(){
        // if(process.env.NODE_ENV === 'production'){
        //     return 1;
        // }
        if(process.env.NODE_ENV === 'development'){
            return nodemailer.createTransport({
                service: 'Gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
        }

        // return nodemailer.createTransport({
        //     host: process.env.EMAIL_HOST,
        //     port: process.env.EMAIL_PORT,
        //     auth:{
        //         user: process.env.EMAIL_USERNAME,
        //         pass: process.env.EMAIL_PASSWORD
        //     }
        // });
    }

    //send actual email
    async send(template, subject){
        //1) Render HTML based on pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url : this.url,
            subject
        })

        //2) Define the mail options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html)
        }

        //3) cerate a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome(){
        await this.send('welcome', 'Welcome to the Natours Family!')
    }

    async sendPasswordReset(){
        await this.send(
            'passwordReset', 
            'Your password reset token (valid for only 10 minutes)'
        )
    }
}

