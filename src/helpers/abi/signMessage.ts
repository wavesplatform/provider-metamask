import { EAbiInputTypes, IAbiSignMessageModel } from '../../Metamask.interface';

export const SIGN_MESSAGE_MODEL: IAbiSignMessageModel = {
	"types": {
		"EIP712Domain": [
			{
				"name": "chainId",
				"type": EAbiInputTypes.UINT_256
			}
		],
		"Message": [{ name: "text", type: EAbiInputTypes.STRING }],
	},
	"domain": {
		"chainId": 83,
	},
	"primaryType": "Message",
	"message": { text: "" },
};
