// import nodemailer, { Transport } from "nodemailer";

// class MailService {
//   transport: Transport
//   constructor() {
//     this.transport = nodemailer.createTransport({
//       name: "informer",
//       version: "1",
//       // send?: "qqq",
//       host: process.env.SMTP_HOST || "smtp.yandex.ru",
//       port: process.env.SMTP_PORT,
//       secure: true,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASSWORD,
//       },
//       debug: true
//     });
//   }

//   async sendActivationMail(to, link) {
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
// module.exports = new MailService();
