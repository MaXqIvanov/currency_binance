import { App } from "vue";
import emitter from "tiny-emitter/instance";
export default {
  install: (app: App) => {
    const messages: string[] = [];
    // update message
    emitter.on("choose-pair", function (arg: string) {
      if (messages.length === 0) {
        messages.push(`diff: значение BTCUSDT было изменено на ${arg}`);
      } else {
        messages.push(
          `diff: значение ${
            messages[messages.length - 1]
          } было изменено на ${arg}`
        );
      }
      emitter.emit("update-messages", messages);
    });
    // get message
    emitter.on("get-messages", function () {
      console.log("get message");
      emitter.emit("update-messages", messages);
    });
  },
};
