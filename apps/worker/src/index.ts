// import "tsconfig-paths/register";
import "dotenv/config";
import logger from "@worker/utils/logger";
import SetUpMqttClient from "@worker/utils/mqtt";

async function main() {
  logger.info('worker start')
  await SetUpMqttClient();
}

main().catch((err) => {
  logger.error(err, "error happens:");
});
