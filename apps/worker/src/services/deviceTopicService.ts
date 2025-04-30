import { getTopicPrefiex } from "@worker/utils/topic";

export const deviceIdParser = (topic: string) => {
  const topicPrefiexLevelCounts = getTopicPrefiex().split('/').length;
  return topic.split('/')[topicPrefiexLevelCounts]
};

export function getDeviceIdGTopic() {
  return `${getTopicPrefiex()}/#`;
}
