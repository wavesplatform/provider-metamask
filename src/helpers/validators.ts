interface IValidateOrderResult {
	status: boolean;
	message?: string;
}

const SUPPORTED_ORDER_VERSION = 4;
const SUPPORTED_PRICE_MODE = ['assetDecimals', 'fixedDecimals'];
const SUPPORTED_ORDER_TYPE = ['BUY', 'SELL'];

export const validateOrder = (order): IValidateOrderResult => {
	let validation = {
		status: true
	};

	if (order.version !== SUPPORTED_ORDER_VERSION) {
		return {
			status: false,
			message: `Provider only supports order version: ${SUPPORTED_ORDER_VERSION}`,
		};
	}

	if (!SUPPORTED_ORDER_TYPE.includes(order.orderType)) {
		return {
			status: false,
			message: `Invalid Order.orderType: ${String(order.orderType)}`,
		};
	}

	if (order.hasOwnProperty('priceMode') && !SUPPORTED_PRICE_MODE.includes(order.priceMode)) {
		return {
			status: false,
			message: `Invalid field "priceMode": ${order.priceMode}\nAvailable values: ${SUPPORTED_PRICE_MODE.join(' | ')}`,
		};
	}

	return validation;
}
