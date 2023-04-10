import { Context, Schema } from "koishi";
import api from "./fetch";
import { modify_key } from "./axios";
import chat from "./actions/chat";
import image from "./actions/image";

export const name = "gpt";

export interface Config {
  api_key: string;
  command: number[];
}

export const Config = Schema.object({
  api_key: Schema.string().default("").required().description("请提供API_KEY"),
  command: Schema.array(Schema.string())
    .default(["chat"])
    .description("呼叫机器人的指令，可填入多种"),
});

export interface CharRecord {
  id: number;
  chatRecord: string;
}

export function apply(ctx: Context, config: Config) {
  // write your plugin here

  ctx.model.extend(
    "chatgpt" as any,
    {
      // 各字段类型
      id: "unsigned",
      chatRecord: "string",
    },
    {
      // 使用自增的主键值
      autoInc: true,
    }
  );

  modify_key(config.api_key);

  // chat
  config.command.forEach((command) => {
    ctx
      .command(`${command} <message>`)
      .option("type", "<val:string>", { fallback: "chat" })
      .option("n", "-n", { fallback: 1 })
      .action(async (_, message) => {

        const { options } = _;

        // 如果你忘记添加 break，那么代码将会从值所匹配的 case 语句开始运行，
        // 然后持续执行下一个 case 语句而不论值是否匹配
        switch (options.type) {
          case "chat":
            chat(ctx, _, message);
            break;
          case "image":
            console.log(1);
            image(ctx, _, message);
            break;
        }
      });
  });

  // chat stop
  ctx.command("chatstop").action(async (_) => {
    const {
      session: { selfId, platform, author, userId },
    } = _;
    await ctx.database.remove("chatgpt" as any, { id: userId });
    _.session.send(
      <>
        <at id={userId} />
        本次聊天已结束
      </>
    );
  });
}
