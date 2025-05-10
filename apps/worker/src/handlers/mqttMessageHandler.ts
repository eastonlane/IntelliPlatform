import mqtt from "mqtt";
import logger from "@worker/utils/logger";
import {
  IMetricsService,
  MetricsService,
} from "@worker/services/metricsService";
import { validate } from "uuid";

const topicPrefix = process.env.MQTT_SUBSCRIBE_TOPIC_PREVIX;
const topicPrefixLevelCount =
  topicPrefix?.split("/").filter((x) => x.length > 0).length ?? 0;
const metricsService: IMetricsService = new MetricsService();

export const OnReceivingMessage: mqtt.OnMessageCallback = async (
  topic,
  message
) => {
  try {
    logger.info(`${topic}: ${message.toString()}`);
    const deviceId = topic.split("/").at(topicPrefixLevelCount);
    if (!deviceId || !validate(deviceId)) {
      return;
    }
    const payload: MqttMessagePayload = JSON.parse(message.toString());
    metricsService
      .RecordMetrics({
        payload: payload.props,
        metaData: {
          deviceId: deviceId,
          tags: payload?.tags?.map(keyValueParser)?.filter((x) => !!x) ?? [],
          fields:
            payload?.fields?.map(keyValueParser)?.filter((x) => !!x) ?? [],
        },
      })
      .catch((err) => logger.error(err, "Error during recording metrics --"));
  } catch (err) {
    logger.error(err, 'Error during handle mqtt message --')
  }
};

function keyValueParser(str: string): { name: string; value: string } | null {
  const subStr = str
    .split(":")
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
  if (subStr.length != 2) {
    return null;
  }
  return {
    name: subStr[0],
    value: subStr[1],
  };
}

interface MqttMessagePayload {
  props: string;
  tags: string[] | null;
  fields: string[] | null;
}
