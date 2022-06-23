import { TypedData } from '@waves/signer';
import {
	IAbi,
	IAbiOrderModel,
	IAbiSignMessageModel,
	IAbiSignTypedDataModel,
	EInvokeArgType,
	IAbiInput
} from '../../Metamask.interface';
import { cloneObj, serializeBinary } from '../../utils';
import { ORDER_MODEL, SIGN_MESSAGE_MODEL, SIGN_TYPED_DATA_MODEL, dataTypeToAbiType } from '../../helpers';

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

	return abiOrderModel;
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

	return abiSignMessageModel;
};

const makeAbiForTypedData = (data: TypedData[]): IAbiInput[] => {
	return data.map((item) => {
		return {
			"name": item.key,
			"type": dataTypeToAbiType(item.type as EInvokeArgType)
		};
	});
}

const makeAbiMessageForSignTypedData = (data: TypedData[]): any => {
	const message = {};

	for (let i = 0; i < data.length; i++) {
		let key = data[i].key;
		let value = data[i].value;

		if (value === EInvokeArgType.BINARY) {
			value = serializeBinary(data[i].value as string);
		}

		message[key] = value;
	}

	return message;
}

export const makeAbiSignTypedDataModel = (
	domainData: Pick<IAbiSignTypedDataModel["domain"], 'chainId' >,
	typedData: TypedData[]
): IAbiSignTypedDataModel => {
	const signTypedData = cloneObj(SIGN_TYPED_DATA_MODEL);
	const domain = cloneObj(domainData);
	const message = makeAbiMessageForSignTypedData(typedData);

	const abiSignTypedDataModel: IAbiSignTypedDataModel = {
		...signTypedData,
		...{
			types: {
				EIP712Domain: signTypedData.types.EIP712Domain,
				TypedData: makeAbiForTypedData(typedData)
			},
			domain: {
				...signTypedData.domain,
				...domain
			},
			message: message
		}
	};

	return abiSignTypedDataModel;
};
