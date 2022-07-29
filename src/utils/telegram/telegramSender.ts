import axios from "axios";

export type PropsSender = {
  token: string;
  chat_id: string;
  text: string;
};

const telegramSender = async (params: PropsSender) => {
  const { token, chat_id, text } = params;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = {
    chat_id,
    text,
    disable_notification: true,
  };

  return await axios
    .post(url, body)
    .then(({ data }) => data)
    .catch(console.log);
};

export default telegramSender;
