import { EAbiInputTypes, IOrderModel } from '../../Metamask.interface';
import { EPriceMode } from '../../ProviderMetamask.interface';


export const ORDER_MODEL: IOrderModel = {
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
		"Order": [
			{
				"name": "version",
				"type": EAbiInputTypes.INT_32
			},
			{
				"name": "matcherPublicKey",
				"type": EAbiInputTypes.STRING
			},
			{
				"name": "amountAsset",
				"type": EAbiInputTypes.STRING
			},
			{
				"name": "priceAsset",
				"type": EAbiInputTypes.STRING
			},
			{
				"name": "orderType",
				"type": EAbiInputTypes.STRING
			},
			{
				"name": "amount",
				"type": EAbiInputTypes.INT_64
			},
			{
				"name": "price",
				"type": EAbiInputTypes.INT_64
			},
			{
				"name": "timestamp",
				"type": EAbiInputTypes.INT_64
			},
			{
				"name": "expiration",
				"type": EAbiInputTypes.INT_64
			},
			{
				"name": "matcherFee",
				"type": EAbiInputTypes.INT_64
			},
			{
				"name": "matcherFeeAssetId",
				"type": EAbiInputTypes.STRING
			},
			{
				"name": "priceMode",
				"type": EAbiInputTypes.STRING
			}
		]
	},
	"primaryType": "Order",
	"domain": {
		"name": "Waves Exchange",
		"version": "1",
		"chainId": 67,
		"verifyingContract": "", // 0x4343434343434343434343434343434343434343
	},

	// https://confluence.wavesplatform.com/pages/viewpage.action?pageId=1680808498#id-78.Metamask-Order
	"message": {
		"version": 4,
		"orderType": 'SELL',
		"matcherPublicKey": '',
		"matcherFeeAssetId": '',
		"amountAsset": '',
		"priceAsset": '',
		"matcherFee": 0, //300000,
		"amount": 0, // 10000000,
		"price": 0, //100000000,
		"timestamp": 0, //1628254368949,
		"expiration": 0, // 1629982368949,
		"priceMode": EPriceMode.ASSET_DECIMALS,
	}
};
