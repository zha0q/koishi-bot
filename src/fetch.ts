import { service } from "./axios";

const V1_CHAT = "/v1/chat/completions";

const CREATE_IMAGE = "/v1/images/generations";

const api = {
  chat: async (chatRecord, _message: string) => {
    const result = await service
      .post(
        V1_CHAT,
        JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [...chatRecord, { role: "user", content: _message }],
          temperature: 0.7,
        })
      )
      .then((res) => {
        return res.data.choices.map((info: any) => info.message);
      });
    return result;
  },
  image: async (_message: string, n: number) => {
    const result = await service
      .post(
        CREATE_IMAGE,
        JSON.stringify({
          prompt: _message,
          n,
          size: "1024x1024",
          response_format: 'b64_json',
        })
      )
      .then((res) => {
        return res.data.data;
      });
    return result;
  },
};

export default api;
