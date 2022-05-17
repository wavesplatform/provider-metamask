import { EAbiInputTypes, IAbiSignMessageModel } from '../../Metamask.interface';

export const SIGN_MESSAGE: IAbiSignMessageModel = {
	"types": {
		"EIP712Domain": [
			{
				"name": "name",
				"type": EAbiInputTypes.STRING
			},
			{
				"name": "version",
				"type": EAbiInputTypes.STRING
			},
			{
				"name": "chainId",
				"type": EAbiInputTypes.UINT_256
			},
			{
				"name": "verifyingContract",
				"type": EAbiInputTypes.ADDRESS
			}
		],
		"Message": [{ name: "text", type: EAbiInputTypes.STRING }],
	},
	"domain": {
		"name": "Waves Exchange",
		"version": "1",
		"chainId": 67,
		"verifyingContract": "", // 0x4343434343434343434343434343434343434343
	},
	"primaryType": "Message",
	"message": { text: "" },
};
