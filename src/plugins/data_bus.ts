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
        if (current_pair !== arg) {
          messages.push(
            `diff: значение ${current_pair} было изменено на ${arg}`
          );
        }
      }
      current_pair = arg;
      emitter.emit("update-messages", messages, current_pair);
    });
    // get message
    emitter.on("get-messages", function () {
      console.log("get message");
      emitter.emit("update-messages", messages, current_pair);
    });
    // get pair
    emitter.on("get-pair", function () {
      console.log("get pair");
      emitter.emit("update-pair", current_pair);
    });
    // change value
    emitter.on("diff_value", function (message: string) {
      messages.push(`diff: ${message}`);
      emitter.emit("update-messages", messages, current_pair);
    });
  },
};
