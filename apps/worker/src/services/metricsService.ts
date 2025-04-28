import createDbConnection from "DAL";
import {
  metrics,
  type MetricsDO,
  type Tag,
  type Field,
} from "DAL/schema/metrics";

export default interface MessageModel {
  metaData: MessageMetaData;
  payload: string;
}

interface MessageMetaData {
  deviceId: string;
  tags: Tag[];
  fields: Field[];
}

export interface IMetricsService {
  RecordMetrics: (msg: MessageModel) => Promise<void>;
}

export class MetricsService implements IMetricsService {
  private db: ReturnType<typeof createDbConnection>;
  constructor() {
    this.db = createDbConnection(process.env.DATABASE_URL!);
  }
  public async RecordMetrics(msg: MessageModel) {
    const properties = JSON.parse(msg.payload);
    const metricsList: MetricsDO[] = [];
    const time = new Date();

    if (typeof properties == "object" && properties != null) {
      for (const [key, value] of Object.entries(properties)) {
        switch (typeof value) {
          case "bigint":
          case "number":
            metricsList.push({
              time: time,
              deviceId: msg.metaData.deviceId,
              name: key,
              valueNumber: value.toString(),
              valueBool: null,
              tagList: msg.metaData.tags,
              fieldList: msg.metaData.fields,
            });
            break;
          case "boolean":
            metricsList.push({
              time: time,
              deviceId: msg.metaData.deviceId,
              name: key,
              valueNumber: null,
              valueBool: value,
              tagList: msg.metaData.tags,
              fieldList: msg.metaData.fields,
            });
          case "string":
          default:
            break;
        }
      }
    }

    if (metricsList.length > 0) {
        await this.db.insert(metrics).values(metricsList)
    }
  }
}
