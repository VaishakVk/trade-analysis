const socketIo = require("socket.io");
let io;
module.exports = {
	connect: (http) => {
		io = socketIo(http);

		io.on("connection", (socket) => {
			// Join every user to room. One room is created for every stock symbol
			socket.on("subscribe", async (stock, cb) => {
				try {
					socket.join(stock);
					cb(null, { message: "You are now subscribed" });
				} catch (err) {
					cb(err, null);
				}
			});
		});
	},
	// Publish to all members subscribed to stock
	publishToSubscribers: (stock, payload) => {
		io.in(stock).emit("ohlc_event", payload);
	},
};
