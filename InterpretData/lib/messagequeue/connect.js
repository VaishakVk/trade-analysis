const amqp = require("amqplib");

const config = { channel: null, connection: null };

/**
 * @function connect
 * @description Connects to RabbitMQ
 */
const connect = async () => {
	try {
		const amqpServer = "amqp://localhost:5672";
		const connection = await amqp.connect(amqpServer);
		config.channel = await connection.createChannel();
		config.connection = connection;
	} catch (err) {
		console.error("Cannot connect to Message Queue", err);
		process.exit(0);
	}
};

module.exports = config;
module.exports.connect = connect;
