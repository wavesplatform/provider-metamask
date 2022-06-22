import { TypedData } from '@waves/signer';
import { IValidationResult } from './interface';

const SUPPORTED_TYPE = ['string', 'integer', 'boolean', 'binary'];
const SUPPORTED_VALUE_TYPE = ['string', 'number', 'boolean'];

export const validateTypedData = (data: TypedData): IValidationResult => {
	let validation = {
		status: true
	};

	if (typeof data.key !== 'string') {
		return {
			status: false,
			message: `Invalid key: ${data.key}\Key should be string`,
		};
	}

	if (!SUPPORTED_TYPE.includes(data.type)) {
		return {
			status: false,
			message: `Invalid type: ${data.type}\nSupports: ${SUPPORTED_TYPE.join(' | ')}`,
		};
	}

	if (!SUPPORTED_VALUE_TYPE.includes(typeof data.value)) {
		return {
			status: false,
			message: `Invalid value type: ${data.value} (${typeof data.value})\nSupports: ${SUPPORTED_VALUE_TYPE.join(' | ')}`,
		};
	}

	switch (data.type) {
		case 'boolean':
			if (typeof data.value !== 'boolean') {
				return {
					status: false,
					message: `Value does not match type: type ${data.type} value ${data.value}`,
				};
			}
			break;
		case 'integer':
			if (typeof data.value !== 'number') {
				return {
					status: false,
					message: `Value does not match type: type ${data.type} value ${data.value}`,
				};
			}
			break;
		case 'string':
			if (typeof data.value !== 'string') {
				return {
					status: false,
					message: `Value does not match type: type ${data.type} value ${data.value}`,
				};
			}
			break;
		case 'binary':
			//  || /(base64:|base58)/.test(data.value)
			if (typeof data.value !== 'string') {
				return {
					status: false,
					message: `Value does not match type: type ${data.type} value ${data.value}`,
				};
			}
			break;
	}

	return validation;
}
