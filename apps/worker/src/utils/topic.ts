const topicPrefix = process.env.MQTT_SUBSCRIBE_TOPIC_PREVIX;

export const getTopicPrefiex = () => {
  const topic = `${topicPrefix}`;
  return topic
};
