import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as alertSchema from "./schema/alert";
import * as deviceSchema from "./schema/device";
import * as metricsSchema from "./schema/metrics";
import * as notificationeSchema from "./schema/notification";
import * as userShema from "./schema/user";

let db: ReturnType<typeof createConnection> | null = null;

export function createDbConnection(url: string) {
  if (!db) {
    if (!url) {
      throw new Error("Database url is not set");
    }
    db = createConnection(url);
  }

  return db;
}

export default class DbLoader {
  constructor(private dbUrl: string) {}

  getDb() {
    if (!!db) return db;
    return createDbConnection(this.dbUrl);
  }
}

function createConnection(url: string) {
  const client = postgres(url);
  return drizzle(client, {
    schema: {
      ...alertSchema,
      ...deviceSchema,
      ...metricsSchema,
      ...notificationeSchema,
      ...userShema,
    },
  });
}
