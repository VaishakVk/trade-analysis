const fileRepo = require("./fileRepo");

/**
 * @function readFileLineByLine
 * @description Reads the sample data and processes.
 * @param req
 * @param res
 * @returns 202 and 500
 */
const readFileLineByLine = async (req, res) => {
	try {
		await fileRepo.getLineByLine();
		return res.status(202).send({
			status: true,
		});
	} catch (err) {
		return res
			.status(err.status || 500)
			.send({ status: false, response: err.message || err });
	}
};

module.exports = { readFileLineByLine };
