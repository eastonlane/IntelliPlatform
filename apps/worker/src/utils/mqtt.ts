import mqtt, { MqttClient } from "mqtt";
import logger from "@worker/utils/logger";
import { OnReceivingMessage } from "@worker/handlers/mqttMessageHandler";
import { getDeviceIdGTopic } from "@worker/services/deviceTopicService";

let client: MqttClient;

async function mqttSubscrbe() {
  const topic = getDeviceIdGTopic();
  await client.subscribeAsync(topic);
  logger.debug("subscribe to topic ", topic);
}

export default async function SetUpMqttClient() {
  if (!process.env.MQTT_SERVER_URL)
    throw new Error("mqtt server url not set up");

  client = mqtt.connect(process.env.MQTT_SERVER_URL, {
    clean: true,
    username: process.env.MQTT_USER_NAME,
    password: process.env.MQTT_PASSWORD,
  });

  client.on("connect", async () => {
    logger.debug("mqtt::connected");
    await mqttSubscrbe();
  });

  client.on("disconnect", () => {
    logger.debug("mqtt::connected");
  });

  client.on("error", (err) => {
    logger.error(err, "mqtt::error: ");
  });

  client.on("reconnect", () => {
    logger.info("mqtt::reconnected");
  });

  client.on("offline", () => {
    logger.warn("mqtt::offline");
  });

  client.on("message", OnReceivingMessage);
}
