const { publishToQueue } = require("../messagequeue/publish");
const stocksCollection = {};

// When the file ends, we use this varaible to close all the other stocks.
let lastTime;

/**
 * @function calculateOHLC
 * @param {object} trade
 * @description calculates open, High, Low and close for every 15 seconds interval
 */
const calculateOHLC = (trade) => {
	const { sym, P, Q, TS2 } = trade;
	lastTime = TS2;
	const stockAttributes = stocksCollection[sym];
	if (!stockAttributes)
		stocksCollection[sym] = {
			barNumber: 1,
			nextInterval: TS2 + 15 * 1000000000,
			currentOpen: P,
			currentHigh: P,
			currentLow: P,
			currentClose: P,
			currentVolume: Q,
			ohlc: [],
		};
	else {
		if (TS2 > stockAttributes["nextInterval"]) {
			closeIntervalAndGenerateNonTrade(sym, TS2);
		}

		// Update open, high, close and volume
		if (!stockAttributes["currentOpen"]) stockAttributes["currentOpen"] = P;
		stockAttributes["currentHigh"] = Math.max(
			stockAttributes["currentHigh"],
			P
		);
		stockAttributes["currentLow"] = Math.min(
			stockAttributes["currentLow"],
			P
		);
		stockAttributes["currentVolume"] = stockAttributes["currentVolume"] + Q;
		stockAttributes["currentClose"] = P;
	}
};

/**
 * @function closeIntervalAndGenerateNonTrade
 * @param {string} sym
 * @param {timestamp} timeToCompare
 * @description closes the bar and generates empty bars if any
 * @description Pushes this data to client microservice
 */
const closeIntervalAndGenerateNonTrade = (sym, timeToCompare) => {
	const stockAttributes = stocksCollection[sym];
	let ohlc = getCurrentOHLC(sym);
	stockAttributes["ohlc"].push(ohlc);
	publishToQueue("ohlc", ohlc);
	resetAndIncrementBarNumber(sym);

	// Generate empty bars if applicable
	while (stockAttributes["nextInterval"] < timeToCompare) {
		let { bar_num } = getCurrentOHLC(sym);
		let payloadToPush = { symbol: sym, bar_num };
		stockAttributes["ohlc"].push(payloadToPush);
		publishToQueue("ohlc", payloadToPush);
		resetAndIncrementBarNumber(sym);
	}
};

/**
 * @function closeFile
 * @description Once file read is complete, close all the existing trades
 */
const closeFile = () => {
	const stocks = Object.keys(stocksCollection);
	stocks.forEach((stock) => {
		closeIntervalAndGenerateNonTrade(stock, lastTime);
	});
};

/**
 * @function getCurrentOHLC
 * @param {string} symbol
 * @description get the current Open High Low and Close
 */
const getCurrentOHLC = (symbol) => {
	const stockAttributes = stocksCollection[symbol];

	const {
		currentOpen,
		currentHigh,
		currentLow,
		currentVolume,
		currentClose,
		barNumber,
	} = stockAttributes;

	let ohlc = {
		symbol,
		open: currentOpen,
		high: currentHigh == Number.MAX_SAFE_INTEGER ? undefined : currentHigh,
		low: currentLow == Number.MIN_SAFE_INTEGER ? undefined : currentLow,
		volume: currentVolume,
		close: currentClose,
		bar_num: barNumber,
	};
	return ohlc;
};

/**
 * @function resetAndIncrementBarNumber
 * @param {string} symbol
 * @description reset open, high, low, close and increments bar number
 */
const resetAndIncrementBarNumber = (symbol) => {
	const stockAttributes = stocksCollection[symbol];
	stockAttributes["barNumber"] = stockAttributes["barNumber"] + 1;
	stockAttributes["nextInterval"] =
		stockAttributes["nextInterval"] + 15 * 1000000000;
	stockAttributes["currentOpen"] = undefined;
	stockAttributes["currentHigh"] = Number.MIN_SAFE_INTEGER;
	stockAttributes["currentLow"] = Number.MAX_SAFE_INTEGER;
	stockAttributes["currentClose"] = 0;
	stockAttributes["currentVolume"] = 0;
};

module.exports = { calculateOHLC, closeFile };
