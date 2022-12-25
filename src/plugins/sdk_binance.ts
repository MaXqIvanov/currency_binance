import axios from "axios";
import { App } from "vue";
export default {
  install: (app: App) => {
    const getOrderBook = async (pair: string) => {
      console.log(pair);
      console.log("this is");
      const response = await axios.get(
        `https://api.binance.com/api/v3/depth?symbol=${pair}&limit=500`
      );
      return response;
    };
    const subscribeOrderBook = async (pair: string) => {
      const socket = new WebSocket(
        `wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@depth@1000ms`
      );
      return socket;
    };
    app.provide("getOrderBook", getOrderBook);
    // subscribeOrderBook
    app.provide("subscribeOrderBook", subscribeOrderBook);
  },
};
