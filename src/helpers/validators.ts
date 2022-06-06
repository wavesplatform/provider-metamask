import { EPriceMode } from '../Provider.interface';
interface IValidateOrderResult {
	status: boolean;
	message?: string;
}

const SUPPORTED_ORDER_VERSION = 4;
const SUPPORTED_PRICE_MODE = [EPriceMode.ASSET_DECIMALS, EPriceMode.FIXED_DECIMALS];
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

	const orderType = String(order.orderType).toUpperCase();
	if (!SUPPORTED_ORDER_TYPE.includes(orderType)) {
		return {
			status: false,
			message: `Invalid field orderType: "${String(order.orderType)}"\nSupports: ${SUPPORTED_ORDER_TYPE.join(' | ')}`,
		};
	}

	if (order.hasOwnProperty('priceMode') && !SUPPORTED_PRICE_MODE.includes(order.priceMode)) {
		return {
			status: false,
			message: `Invalid field priceMode: "${order.priceMode}"\nSupports: ${SUPPORTED_PRICE_MODE.join(' | ')}`,
		};
	}

	return validation;
}
