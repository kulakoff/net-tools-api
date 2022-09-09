require("dotenv").config();
import nodemailer, { SentMessageInfo } from "nodemailer";
import fs from "fs";

const smtpHostname: string = process.env.MAIL_SMTP_HOST || "localhost",
  smtpPort: number = process.env.MAIL_SMTP_PORT
    ? +process.env.MAIL_SMTP_PORT
    : 35,
  sntpUser: string = process.env.MAIL_SMTP_USERNAME || "example_username",
  smtpPasswd: string = process.env.MAIL_SMTP_PASSWORD || "example_password",
  emailReplyTo: string = process.env.MAIL_REPLYTO || "emailReplyTo",
  emailCopy1: string = process.env.MAIL_ADDRESS_COPY1 || "MAIL_ADDRESS1",
  emailBcc: string = process.env.MAIL_ADDRESS_BCC || "MAIL_ADDRESS2";

class MailService {
  transporter: SentMessageInfo;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: smtpHostname,
      port: smtpPort,
      auth: {
        user: sntpUser, // generated ethereal user
        pass: smtpPasswd, // generated ethereal password
      },
    });
  }

  /**
   * Отправка отчета в сбытовую компанию
   * @param to email
   * @param filename attach file name
   * @param reportDate
   * @returns info send status
   */
  async sendReport(
    to: string,
    filename: string,
    reportDate: string = new Date().toLocaleDateString("RU")
  ) {
    const info: SentMessageInfo = await this.transporter.sendMail({
      from: `"ООО ЛАНТА, приборы учета" <${sntpUser}>`, // адрес отправителя
      // to: `${to}, ${emailReplyTo}, ${emailCopy1}`, // список получателей
      to: `${to}`, // TODO:  вернуть прежнюю строку с получателями
      replyTo: emailReplyTo, // адрес для ответа
      bcc: emailBcc, // скрытая копия
      subject: `ООО ЛАНТА, показания приборов учета ${reportDate} ✔`, // Subject line
      html: `<div>Здравствуйте, во вложении файл с показаниями счетчиков от ${reportDate}</div>
            <div>Пожалуйста, не отвечайте на это письмо, так как оно сформировано автоматически.</div>
            <div>Если у Вас есть дополнительные вопросы, Вы можете использовать этот адрес для ответа: <a href="mailto:${emailReplyTo}">${emailReplyTo}</a></div>
            `, // plain text body
      attachments: [
        {
          filename,
          content: fs.createReadStream(`./reports/${filename}`),
        },
      ],
    });

    return info;
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
