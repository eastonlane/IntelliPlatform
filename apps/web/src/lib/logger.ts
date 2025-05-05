import pino from 'pino';

const logger = pino({
	transport: {
		target: 'pino-pretty', // optional: human-readable output
		options: {
			colorize: true
		}
	}
});

export default logger;
