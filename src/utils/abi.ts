import { IAbi, IAbiOrderModel, IAbiSignMessageModel } from '../Metamask.interface';
import { cloneObj } from '../utils';
import { ORDER_MODEL, SIGN_MESSAGE_MODEL } from '../helpers';

export const findInvokeAbiByName = (abiList: IAbi[], name): IAbi | undefined => {
	let abi: IAbi | undefined= abiList.find((item) => {
		return item.name === name;
	});

	return abi;
};

export const makeAbiOrderModel = (
	domainData: Pick<IAbiOrderModel["domain"], 'chainId'>,
	messageData: IAbiOrderModel["message"]
): IAbiOrderModel => {
	const orderModel = cloneObj(ORDER_MODEL);
	const domain = cloneObj(domainData);
	const message = cloneObj(messageData);

	const abiOrderModel: IAbiOrderModel = {
		...orderModel,
		...{
			domain: {
				...orderModel.domain,
				...domain
			},
			message: {
				...message
			}
		}
	};

	return cloneObj(abiOrderModel);
};

export const makeAbiSignMessageModel = (
	domainData: Pick<IAbiSignMessageModel["domain"], 'chainId' >,
	messageData: IAbiSignMessageModel["message"]
): IAbiSignMessageModel => {
	const signMessage = cloneObj(SIGN_MESSAGE_MODEL);
	const domain = cloneObj(domainData);
	const message = cloneObj(messageData);

	const abiSignMessageModel: IAbiSignMessageModel = {
		...signMessage,
		...{
			domain: {
				...signMessage.domain,
				...domain
			},
			message: {
				...message
			}
		}
	};

	return cloneObj(abiSignMessageModel);
};
