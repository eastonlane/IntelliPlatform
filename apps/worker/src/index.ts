import "dotenv/config";
import mqtt, { MqttClient } from "mqtt";

let client: MqttClient;
const topicPrefix = process.env.MQTT_SUBSCRIBE_TOPIC_PREVIX
const topicPrefixLevelCount = topicPrefix?.split('/').length ?? 0

const onMqttMessage: mqtt.OnMessageCallback = (topic, message) => {

  console.log(topic, message.toString());

  const deviceId = topic.split('/').at(topicPrefixLevelCount)
};

async function mqttSubscrbe() {
  const topic = `${topicPrefix}/#`;
  await client.subscribeAsync(topic);
  console.log('subscribe to topic ', topic)
}

async function setUpMqttClient() {
  if (!process.env.MQTT_SERVER_URL)
    throw new Error("mqtt server url not set up");

  client = mqtt.connect(process.env.MQTT_SERVER_URL, {
    clean: true,
    username: process.env.MQTT_USER_NAME,
    password: process.env.MQTT_PASSWORD,
  });

  client.on("connect", async () => {
    console.log("mqtt::connected");
    await mqttSubscrbe();
  });

  client.on("disconnect", () => {
    console.log("mqtt::connected");
  });

  client.on("error", (err) => {
    console.log("mqtt::error: ", err);
  });

  client.on("reconnect", () => {
    console.log("mqtt::reconnected");
  });

  client.on("offline", () => {
    console.log("mqtt::offline");
  });

  client.on("message", onMqttMessage);
}

async function main() {
  await setUpMqttClient();
}

main().catch((err) => {
  console.log("error happens:", err);
});
