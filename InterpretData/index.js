const { connect } = require("./lib/messagequeue/connect");
const { consume } = require("./lib/messagequeue/consume");

// Connects to Rabbit MQ and listens to incoming messages
connect().then(() => {
	consume();
});
