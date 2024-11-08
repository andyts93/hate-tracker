import KeyvRedis from "@keyv/redis";
import { createCache } from "cache-manager";
import { Keyv } from "keyv";

export const cache = createCache({
  stores: [
    new Keyv({
      store: new KeyvRedis(process.env.REDIS_URL || ""),
    }),
  ],
});
