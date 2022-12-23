import { App } from "vue";
import emitter from "tiny-emitter/instance";
export default {
  install: (app: App) => {
    const messages: string[] = [];
    let current_pair: string = "BTCUSDT";
    // update message
    emitter.on("choose-pair", function (arg: string) {
      if (messages.length === 0) {
        messages.push(`diff: значение BTCUSDT было изменено на ${arg}`);
      } else {
        messages.push(`diff: значение ${current_pair} было изменено на ${arg}`);
      }
      current_pair = arg;
      emitter.emit("update-messages", messages, current_pair);
    });
    // get message
    emitter.on("get-messages", function () {
      console.log("get message");
      emitter.emit("update-messages", messages, current_pair);
    });
    emitter.on("get-pair", function () {
      console.log("get pair");
      emitter.emit("update-pair", current_pair);
    });
  },
};
