import { IAbi, IAbiOrderModel, IAbiSignMessageModel } from '../Metamask.interface';
import { ORDER_MODEL, SIGN_MESSAGE } from '../config';
import { ChainId } from '@waves/ts-types';

export const findInvokeAbiByName = (abiList: IAbi[], name): IAbi | undefined => {
	let abi: IAbi | undefined= abiList.find((item) => {
		return item.name === name;
	});

	return abi;
};

export const makeAbiOrderModel = (
	domain: Pick<IAbiOrderModel["domain"], 'chainId' | 'verifyingContract'>,
	message: IAbiOrderModel["message"]
): IAbiOrderModel => {
	const abiOrderModel: IAbiOrderModel = {
		...ORDER_MODEL,
		...{
			domain: {
				...ORDER_MODEL.domain,
				...domain
			},
			message: {
				...message
			}
		}
	};

	return abiOrderModel;
};

export const makeAbiSignMessageModel = (
	domain: Pick<IAbiSignMessageModel["domain"], 'chainId' | 'verifyingContract'>,
	message: IAbiSignMessageModel["message"]
): IAbiSignMessageModel => {
	const abiSignMessageModel: IAbiSignMessageModel = {
		...SIGN_MESSAGE,
		...{
			domain: {
				...SIGN_MESSAGE.domain,
				...domain
			},
			message: {
				...message
			}
		}
	};

	return abiSignMessageModel;
};
