// import "tsconfig-paths/register";
import "dotenv/config";
import logger from "@/utils/logger";
import SetUpMqttClient from "@/utils/mqtt";

async function main() {
  logger.info('abc')
  await SetUpMqttClient();
}

main().catch((err) => {
  logger.error(err, "error happens:");
});
