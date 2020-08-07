const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { publishToQueue } = require("../messagequeue/publish");

/**
 * @function getLineByLine
 * @description Creates a stream and reads it line by line and publishes it to trade queue
 */
const getLineByLine = () => {
	return new Promise((resolve, reject) => {
		try {
			const readInterface = readline.createInterface({
				input: fs.createReadStream(
					path.join(__dirname, "../../data/trades.json")
				),
				output: null,
				console: false,
			});
			readInterface.on("line", async (line) => {
				// counter += 1;
				// if (counter % 1000 == 0) console.log({ counter });
				await publishToQueue("trade", line);
			});

			readInterface.on("close", async () => {
				await publishToQueue("endOfFile", "File closed");
			});
			resolve();
		} catch (err) {
			reject(err);
		}
	});
};

module.exports = {
	getLineByLine,
};
