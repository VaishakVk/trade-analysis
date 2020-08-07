const config = require("./connect");

/**
 * @function publishToQueue
 * @param {string} queue
 * @param {any} payload
 * @description publishes data to the given queue
 */
const publishToQueue = async (queue, payload) => {
	try {
		await config.channel.assertQueue(queue);
		await config.channel.sendToQueue(
			queue,
			Buffer.from(JSON.stringify(payload))
		);
	} catch (err) {
		throw err;
	}
};

module.exports = { publishToQueue };
