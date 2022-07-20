// todo move away (signer)
export interface IUser extends IUserData {
	id: number;
	path: string;
}

// todo move away (signer)
export interface IUserData {
	publicKey: string;
	address: string;
	statusCode: string;
}

export interface IWavesConfig {
	nodeUrl?: string;
	chainId?: number; // deprecated
}

export interface IProviderMetamaskConfig {
	debug?: boolean;
	wavesConfig?: IWavesConfig;
}

export enum EPriceMode {
	ASSET_DECIMALS = 'assetDecimals',
	FIXED_DECIMALS = 'fixedDecimals',
}

export interface IOrderData {
	version: number;
	orderType: 'buy' | 'sell';
	matcherPublicKey: string,
	matcherFeeAssetId: string,
	assetPair: {
		amountAsset: string;
		priceAsset: string;
	};
	matcherFee: number;
	amount: number;
	price: number;
	timestamp: number;
	expiration: number;
	priceMode: 'assetDecimals' | 'fixedDecimals';
};
