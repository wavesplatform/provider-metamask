import { InvokeScriptCallArgument, Long } from '@waves/ts-types';
import { base58Decode, base64Decode } from '@waves/ts-lib-crypto';
import { bytesToHexString } from './common';
import {
	IAbiInput,
	EAbiInputTypes,
	EInvokeArgType,
	TupleCortege,
} from '../Metamask.interface'

const serializeBinary = (value: string): string => {
	if (value.indexOf('base64:') === 0) {
		value = value.slice(6);

		return bytesToHexString(base64Decode(value));
	} else if (value.indexOf('base58:') === 0) {
		value = value.slice(6);

		return bytesToHexString(base58Decode(value));
	} else {
		return value;
	}
};

const abiInputDefaultValue = {
	[EAbiInputTypes.BOOL]: false,
	[EAbiInputTypes.BYTES]: '0x',
	[EAbiInputTypes.INT_64]: 0,
	[EAbiInputTypes.STRING]: '',
};

const abiToInvokeArgType = (abiType: EAbiInputTypes): EInvokeArgType => {
	switch (abiType) {
		case EAbiInputTypes.BOOL:
			return EInvokeArgType.BOOLEAN;
		case EAbiInputTypes.BYTES:
			return EInvokeArgType.BINARY;
		case EAbiInputTypes.INT_64:
			return EInvokeArgType.INTEGER;
		case EAbiInputTypes.STRING:
			return EInvokeArgType.STRING;
		default:
			return EInvokeArgType.BOOLEAN;
	}
}

// TODO work only for simple types
const makeTupleItem = (abiInputs: IAbiInput[], param: InvokeScriptCallArgument<Long>): TupleCortege => {
	const DEFAULT_INDEX = 0;

	const cortege = [DEFAULT_INDEX];

	for(var i = 1; i < abiInputs.length; i++) {
		const component: IAbiInput = abiInputs[i];
		const invokeTypeByAbi = abiToInvokeArgType(component.type);

		// is same type
		if(invokeTypeByAbi === param.type) {
			cortege[0] = i - 1; // set index
			cortege[i] = serializeInvokeParam(component, param.value);
		} else {
			cortege[i] = abiInputDefaultValue[component.type];
		}
	}

	return cortege;
};

const serializeInvokeParam = (abiInput: IAbiInput, value: any) => {
	const type = abiInput.type;

	switch (type) {
		case EAbiInputTypes.ADDRESS:
		case EAbiInputTypes.BOOL:
		case EAbiInputTypes.INT_32:
		case EAbiInputTypes.INT_64:
		case EAbiInputTypes.STRING:
			return value;
		case EAbiInputTypes.BYTES:
			return serializeBinary(value); // todo check type
		case EAbiInputTypes.TUPLE:
			return makeTupleItem(abiInput.components!, value);
		case EAbiInputTypes.LIST_BOOL:
		case EAbiInputTypes.LIST_INT_64:
		case EAbiInputTypes.LIST_STRING:
			return value.map((param) => param.value);
		case EAbiInputTypes.LIST_BYTES:
			return value.map((param) => serializeBinary(param.value));
		case EAbiInputTypes.LIST_TUPLE:
			return value.map(makeTupleItem.bind(null, abiInput.components!));
	}
};

export const serializeInvokeParams = (params: any, abiInputs: IAbiInput[]): any[] => {
	return params.map((item, index) => {
		return serializeInvokeParam(abiInputs[index], item.value);
	});
};
