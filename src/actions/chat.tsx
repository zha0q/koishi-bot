import { Context } from "koishi";
import api from "../fetch";

export default async function (ctx: Context, _, _message) {
  const {
    session: { selfId, platform, author, userId },
  } = _;
  // 之前的聊天记录，传给请求所用
  let chatRecord = [];
  // 数据库查找历史聊天记录JSON
  const chatRecordJson = (
    await ctx.database.get("chatgpt" as any, { id: Number(userId) })
  )?.[0]?.chatRecord;
  // 库中找到了就 解析后赋值
  if (chatRecordJson) chatRecord = JSON.parse(chatRecordJson as any);
  const answerChatRecord = await api.chat(chatRecord, _message);

  // 存入聊天记录
  if (chatRecord.length) {
    await ctx.database.set(
      "chatgpt" as any,
      { id: Number(userId) },
      {
        chatRecord: JSON.stringify(
          chatRecord.concat(
            [{ role: "user", content: _message }],
            answerChatRecord
          )
        ),
      }
    );
    // 创建聊天记录
  } else {
    await ctx.database.create("chatgpt" as any, {
      id: Number(userId),
      chatRecord: JSON.stringify(
        chatRecord.concat(
          [{ role: "user", content: _message }],
          answerChatRecord
        )
      ),
    });
  }
  answerChatRecord.forEach((_chat: any) => {
    _.session.send(
      <>
        <at id={userId} />
        {_chat.content}
      </>
    );
  });
}
