import { App } from "vue";
import emitter from "tiny-emitter/instance";
export default {
  install: (app: App) => {
    let messages: string[] = [];
    let current_pair: string = "BTCUSDT";
    // update message
    emitter.on("choose-pair", function (arg: string) {
      if (current_pair !== arg) {
        messages = [
          `diff: значение ${current_pair} было изменено на ${arg}`,
          ...messages,
        ];
        current_pair = arg;
        emitter.emit("update-messages", messages, current_pair);
      }
    });
    // get message
    emitter.on("get-messages", function () {
      emitter.emit("update-messages", messages, current_pair);
    });
    // get pair
    emitter.on("get-pair", function () {
      emitter.emit("update-pair", current_pair);
    });
    // change value
    emitter.on("diff_value", function (message: string) {
      messages = [message, ...messages];
      if (messages.length > 150) {
        messages = messages.slice(0, 100);
      }
      emitter.emit("update-messages", messages, current_pair);
    });
  },
};
