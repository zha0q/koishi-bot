import { Context } from "koishi";
import api from "../fetch";

export default async function (ctx: Context, _, _message) {
  const {
    session: { userId },
    options,
  } = _;

  const answerImageGroup = await api.image(_message, options.n);
  answerImageGroup.forEach((_image: any) => {
    console.log(_image.url)
    _.session.send(
      <>
        <image url={'data:image/png;base64,' + _image.url.toString('base64')}/>
      </>
    );
  });
}
