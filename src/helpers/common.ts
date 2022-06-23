import { EAbiInputTypes, EInvokeArgType } from '../Metamask.interface';

export const abiToInvokeArgType = (abiType: EAbiInputTypes): EInvokeArgType => {
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
			throw 'Invalid abiType';
	}
};

export const dataTypeToAbiType = (dataType: EInvokeArgType): EAbiInputTypes => {
	switch (dataType) {
		case EInvokeArgType.BOOLEAN:
			return EAbiInputTypes.BOOL;
		case EInvokeArgType.BINARY:
			return EAbiInputTypes.BYTES;
		case EInvokeArgType.INTEGER:
			return EAbiInputTypes.INT_64;
		case EInvokeArgType.STRING:
			return EAbiInputTypes.STRING;
		default:
			throw 'Invalid dataType'
	}
};
