const config = require("./connect");
const { publishToSubscribers } = require("../../sockets");

/**
 * @function consume
 * @description Listens to incoming messages in queues
 */
const consume = async () => {
	try {
		config.channel.consume("ohlc", (message) => {
			const input = JSON.parse(message.content.toString());
			publishToSubscribers(input.symbol, input);
			config.channel.ack(message);
		});
	} catch (ex) {
		console.error(ex);
	}
};

module.exports = { consume };
