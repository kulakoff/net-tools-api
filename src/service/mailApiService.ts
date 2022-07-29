require("dotenv").config();
import axios from "axios";
import fs from "fs";
let FormData = require('form-data');


class mailApiService {
  from_email: string
  from_name: string
  constructor() {
    this.from_email = process.env.MAIL_FROM_EMAIL || "email";
    this.from_name = process.env.MAIL_FROM_NAME || "name";
  }
  async sendActivationMail(to: string, link: string) {
    let data = JSON.stringify({
      from_email: this.from_email,
      from_name: this.from_name,
      to: to,
      subject: "Активация учетной записи",
      html: `<div><h1>Для активации перейдите по ссылке</h1><a href='${link}'>${link}</a></div>`,
    });

    let config = {
      method: "post",
      url: "https://api.mailopost.ru/v1/email/messages",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MAIL_API_TOKEN}`,
      },
      data: data,
    };

    await axios(config);

  }
  async sendReportMail(to: string, fileName: string) {
    const form = new FormData();

    form.append('subject', 'Показания приборов учета');
    form.append('to', to);
    form.append('from_email', this.from_email)
    form.append('attachments[]', fs.createReadStream(`./reports/${fileName}`))
    form.append('html', `<h1>Файл с показаниями приборов учета во вложении: ${fileName}</h1>`)

    const config = {
      method: "post",
      url: "https://api.mailopost.ru/v1/email/messages",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${process.env.MAIL_API_TOKEN}`,
      },
      data: form,
    };

    const response = await axios(config)
    return response;

  }
}

export default new mailApiService();
