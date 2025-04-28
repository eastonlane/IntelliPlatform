import mqtt from "mqtt";
import logger from "@/utils/logger";

const topicPrefix = process.env.MQTT_SUBSCRIBE_TOPIC_PREVIX;
const topicPrefixLevelCount =
  topicPrefix?.split("/").filter((x) => x.length > 0).length ?? 0;

export const OnReceivingMessage: mqtt.OnMessageCallback = async (
  topic,
  message
) => {
  logger.info(`${topic}: ${message.toString()}`);
  const deviceId = topic.split("/").at(topicPrefixLevelCount);
};
