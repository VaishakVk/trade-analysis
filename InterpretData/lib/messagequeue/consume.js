const config = require("./connect");
const { calculateOHLC, closeFile } = require("../trade/tradeRepo");

/**
 * @function consume
 * @description Listens to incoming messages in queues
 */
const consume = async () => {
	try {
		config.channel.consume("trade", (message) => {
			const input = message.content.toString();
			const trade = JSON.parse(JSON.parse(input));
			config.channel.ack(message);
			calculateOHLC(trade);
		});
		config.channel.consume("endOfFile", (message) => {
			config.channel.ack(message);
			closeFile();
		});
	} catch (ex) {
		console.error(ex);
	}
};

module.exports = { consume };
