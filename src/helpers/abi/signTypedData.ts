import { EAbiInputTypes, IAbiSignTypedDataModel } from '../../Metamask.interface';

export const SIGN_TYPED_DATA_MODEL: IAbiSignTypedDataModel = {
	"types": {
		"EIP712Domain": [
			{
				"name": "chainId",
				"type": EAbiInputTypes.UINT_256
			}
		],
		"TypedData": []
	},
	"domain": {
		"chainId": 83,
	},
	"primaryType": "TypedData",
	"message": { },
};
