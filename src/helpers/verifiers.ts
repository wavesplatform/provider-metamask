export const verifyOrder = (order) => {
	let verified = {
		status: true,
		message: '',
	};

	const orderType = String(order.orderType).toUpperCase();
	if (orderType !== 'SELL' && orderType !== 'BUY') {
		verified = {
			status: false,
			message: `Invalid Order.orderType: ${String(order.orderType)}`
		};
	}

	return verified;
}