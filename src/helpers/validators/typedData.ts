import { TypedData } from '@waves/signer';
import { IValidationResult } from './interface';

const SUPPORTED_TYPE = ['string', 'integer', 'boolean', 'binary'];
const SUPPORTED_VALUE_TYPE = ['string', 'number', 'boolean'];

export const validateTypedData = (data?: TypedData[] | null): IValidationResult => {
	let validation = {
		status: true
	};

	if (!data || data.length === 0) {
		return {
			status: false,
			message: 'Empty typed data',
		};
	}

	const keys = data.map((item: TypedData) => item.key);
	const duplicates = keys.filter((element, index) =>  keys.indexOf(element) !== index );
	if (duplicates.length) {
		return {
			status: false,
			message: `Duplicate keys: ${duplicates.join(', ')}`
		};
	}

	for (let i = 0; i < data.length; i++) {
		const res = validateTypedDataItem(data[i]);

		if (res.status === false) {
			return res;
		}
	}

	return validation;
}

const validateTypedDataItem = (data: TypedData): IValidationResult => {
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

	let typeValueMatched = true;
	switch (data.type) {
		case 'boolean':
			if (typeof data.value !== 'boolean') {
				typeValueMatched = false;
			}
			break;
		case 'integer':
			if (typeof data.value !== 'number') {
				typeValueMatched = false;
			}
			break;
		case 'string':
			if (typeof data.value !== 'string') {
				typeValueMatched = false;
			}
			break;
		case 'binary':
			//  || /(base64:|base58)/.test(data.value)
			if (typeof data.value !== 'string') {
				typeValueMatched = false;
			}
			break;
	}

	if (!typeValueMatched) {
		return {
			status: false,
			message: `Value does not match type: type ${data.type} key ${data.key} value ${data.value}`,
		};
	}
	return validation;
}
