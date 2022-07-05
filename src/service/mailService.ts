require("dotenv").config();
import nodemailer, { SentMessageInfo } from "nodemailer";
import fs from "fs"

const smtpHostname: string = process.env.MAIL_SMTP_HOST || "localhost"
const smtpPort: number = process.env.MAIL_SMTP_PORT ? +process.env.MAIL_SMTP_PORT : 35
const sntpUser: string = process.env.MAIL_SMTP_USERNAME || "example_username"
const smtpPasswd: string = process.env.MAIL_SMTP_PASSWORD || "example_password"

// class MailService {
//   transport: SentMessageInfo;
// //   transport: Transport
//   constructor() {
//     this.transport = nodemailer.createTransport({

//     //   name: "informer",
//     //   version: "1",
//       // send?: "qqq",
//       host: process.env.SMTP_HOST || "zimbra.lanta-net.ru" ,
//       port: process.env.SMTP_PORT ,
//     //   secure: true,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASSWORD,
//       },
//       debug: true
//     });
//   }

//   async sendActivationMail(to:string, link:string) {
//     console.log(`send mail to ${to}`);
//     //TODO: сделать интеграцию с сервисом рассылок
//     await this.transport.sendMail({
//       from: process.env.SMTP_MAIL_FROM,
//       to,
//       subject: `Активация на ${process.env.API_URL}`,
//       text: "",
//       html: `
//       <div>
//       <h1>Для активации перейдите по ссылке</h1>
//       <a href="${link}">${link}</a>
//       </div>
//       `,
//     });
//   }
// }


class MailService {
    transporter: SentMessageInfo
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: smtpHostname,
            port: smtpPort,
            auth: {
                user: sntpUser, // generated ethereal user
                pass: smtpPasswd, // generated ethereal password
            },
        })
    }
    //отправка отчета в сбытовую компанию
    async sendReport(to: string, filename: string, reportDate: string = new Date().toLocaleDateString('RU')) {
        const info: SentMessageInfo = await this.transporter.sendMail({
            from: '"ООО ЛАНТА, приборы учета" <kav@lanta-net.ru>', // sender address
            to, // list of receivers
            // bcc: 'akulakov@lanta-net.ru', //скрытая копия
            subject: `ООО ЛАНТА, показания счетчиков ${reportDate} ✔`, // Subject line
            html: `<div>Здравствуйте, во вложении файл с показаниями счетчиков от ${reportDate}</div>
            <div>Пожалуйста, не отвечайте на это письмо, так как оно сгенерировано автоматически.</div>
            <div>Если у Вас есть дополнительные вопросы, Вы можете использовать этот адрес для ответа: <a href="mailto:tech@lanta-net.ru">tech@lanta-net.ru</a></div>
            `, // plain text body
            attachments: [{
                filename,
                content: fs.createReadStream(`./reports/${filename}`)
            }]
        });



        return info
    }

    async sendActivationMail(to: string, link: string) {
        console.log(`send mail to ${to}`);
        //TODO: сделать интеграцию с сервисом рассылок
        await this.transporter.sendMail({
            from: process.env.SMTP_MAIL_FROM,
            to,
            subject: `Активация на ${process.env.API_URL}`,
            text: "",
            html: `
      <div>
      <h1>Для активации перейдите по ссылке</h1>
      <a href="${link}">${link}</a>
      </div>
      `,
        });
    }

}


export default new MailService();
