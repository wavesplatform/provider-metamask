import {
	AuthEvents,
	ConnectOptions,
	Handler,
	Provider,
	SignerTx,
	TypedData,
	UserData
} from '@waves/signer';
import { ethAddress2waves, ethTxId2waves, wavesAddress2eth, wavesAsset2Eth } from '@waves/node-api-js';
import { TRANSACTION_TYPE } from '@waves/ts-types';

import { IUser, IProviderMetamaskConfig, IOrderData, EPriceMode } from './Provider.interface';
import { IAbiOrderModel, MetamaskSign, IAbiSignTypedDataModel } from './Metamask.interface';
import { DEFAULT_PROVIDER_CONFIG, DEFAULT_WAVES_CONFIG } from './config';
import {
	formatPayments,
	getMetamaskNetworkConfig,
	prepareAssetId,
	serializeInvokeParams,
	cloneObj,
	promisify
} from './utils';
import {
	findInvokeAbiByName,
	toMetamaskPriceMode,
	makeAbiOrderModel,
	makeAbiSignMessageModel,
	makeAbiSignTypedDataModel,
	validateOrder,
	validateTypedData,
} from './helpers';
import metamaskApi, { isMetaMaskInstalled } from './metamask';

export class ProviderMetamask implements Provider {
	public isSignAndBroadcastByProvider = true;
	public user: IUser | null = null;

	private _config: IProviderMetamaskConfig;
	private _connectOptions: ConnectOptions | null;
	private _connectPromisify: ReturnType<typeof promisify>;

	constructor(config?: IProviderMetamaskConfig) {
		if (!isMetaMaskInstalled()) {
			throw 'Metamask is not installed';
		}

		if (config?.wavesConfig) {
			console.warn('ProviderMetamask: config.wavesConfig is deprecated and will be removed. Just omit it.');
		}

		if (config?.wavesConfig?.chainId) {
			console.warn('ProviderMetamask: config.wavesConfig.chainId is deprecated and will be removed. Just omit it.');
		}

		if (config?.wavesConfig?.nodeUrl) {
			console.warn('ProviderMetamask: config.wavesConfig.nodeUrl is deprecated and will be removed. Just omit it.');
		}

		this._config = config || DEFAULT_PROVIDER_CONFIG;
		this._connectOptions = null;

		this._connectPromisify = promisify();

		this.__log('constructor', this._config);
	}

	public async login(): Promise<UserData> {
		this.__log('login');

		await this._connectPromisify.promise;
		await this.trySwitchNetwork();

		const users = await metamaskApi.requestAccounts();
		// const users = await metamaskApi.getAccounts();

		if(users?.length) {
			const ethAddr: string = users[0];

			// base64 > base58 // removed https://jira.wavesplatform.com/browse/LIBS-163
			// const publicKey = await metamaskApi.getEncryptionPublicKey(ethAddr);
			// const bytesFromBase64 = base64Decode(publicKey);
			// const base58String = base58Encode(bytesFromBase64);

			this.user = {
				id: 0,
				path: '',
				publicKey: '',
				address: ethAddress2waves(ethAddr, this._connectOptions!.NETWORK_BYTE),
				statusCode: ''
			};

			this.__log('login :', this.user);

			return this.user;
		} else {
			throw 'Can not get user from metamask';
		}
	}

	public logout(): Promise<void> {
		this.__log('logout');

		return Promise.resolve();
	}

	public async sign(list: Array<SignerTx>): Promise<Array<any>> {
		this.__log('sign');

		await this._connectPromisify.promise;
		await this.trySwitchNetwork();

		return Promise.all(list.map(this.signOneTx, this))
			.then((txList) => {
				if(txList.length === 1) {
					return txList[0];
				} else {
					return txList;
				}
			});
	}

	public async signMessage(data: string): Promise<MetamaskSign> {
		this.__log('signMessage :', data);

		await this._connectPromisify.promise;
		await this.trySwitchNetwork();

		const chainId = this._connectOptions!.NETWORK_BYTE;

		const abiSignMessage = makeAbiSignMessageModel({
			chainId: chainId,
		}, { text: data });

		this.__log('signMessage :: metamaskApi.signMessage :', abiSignMessage);
		const result = await metamaskApi.signTypedDataV4(JSON.stringify(abiSignMessage));
		this.__log('signMessage :: metamaskApi.signMessage :: result :', result);

		return result;
	}

	public async signTypedData(data: TypedData[]): Promise<MetamaskSign> {
		this.__log('signTypedData :', data);

		await this._connectPromisify.promise;
		await this.trySwitchNetwork();

		const validate = validateTypedData(data);
		if (validate.status === false) {
			throw new Error(validate.message);
		}

		const chainId = this._connectOptions!.NETWORK_BYTE;
		const abiSignTypedData: IAbiSignTypedDataModel = makeAbiSignTypedDataModel({
			chainId,
		}, data);

		this.__log('signTypedData :: metamaskApi.signTypedData :', abiSignTypedData);
		const result = await metamaskApi.signTypedDataV4(JSON.stringify(abiSignTypedData));
		this.__log('signTypedData :: metamaskApi.signTypedData :: result :', result);

		return result;
	}

	public async signOrder(orderData: IOrderData): Promise<MetamaskSign> {
		this.__log('signOrder :', orderData);

		await this._connectPromisify.promise;
		await this.trySwitchNetwork();

		const order = cloneObj(orderData);
		const chainId = this._connectOptions!.NETWORK_BYTE;

		order.matcherFeeAssetId = prepareAssetId(order.matcherFeeAssetId);
		order.assetPair.amountAsset = prepareAssetId(order.assetPair.amountAsset);
		order.assetPair.priceAsset = prepareAssetId(order.assetPair.priceAsset);

		const validate = validateOrder(order);
		if (validate.status === false) {
			throw new Error(validate.message);
		}

		const abiOrderModel: IAbiOrderModel = makeAbiOrderModel({
			chainId: chainId,
		},{
			"version": order.version,
			"orderType": order.orderType.toUpperCase() as ('BUY' | 'SELL'),
			"matcherPublicKey": order.matcherPublicKey,
			"matcherFeeAssetId": order.matcherFeeAssetId,
			"amountAsset": order.assetPair.amountAsset,
			"priceAsset": order.assetPair.priceAsset,
			"matcherFee": order.matcherFee,
			"amount": order.amount,
			"price": order.price,
			"timestamp": order.timestamp,
			"expiration": order.expiration,
			"priceMode": toMetamaskPriceMode(order.priceMode as EPriceMode),
		});

		this.__log('signOrder :: metamaskApi.signOrder :', abiOrderModel);
		const result = await metamaskApi.signTypedDataV4(JSON.stringify(abiOrderModel));
		this.__log('signOrder :: metamaskApi.signOrder :: result :', result);

		return result;
	}

	public async connect(options: ConnectOptions): Promise<void> {
		this.__log('connect', options);

		this._connectOptions = { ...options };

		this._connectPromisify.resolve();
	}

	private async trySwitchNetwork() {
		this.__log('trySwitchNetwork');

		const networkConfig = getMetamaskNetworkConfig(this._connectOptions!.NETWORK_BYTE);

		if(networkConfig == null) {
			this.__log('trySwitchNetwork :: skiped');
			return;
		}

		await metamaskApi.addEthereumChain(networkConfig);

		try {
			this.__log('trySwitchNetwork :: metamaskApi.switchEthereumChain', networkConfig);
			await metamaskApi.switchEthereumChain(networkConfig);
		} catch (error) {
			throw error;
			// this.__log('trySwitchNetwork :: metamaskApi.switchEthereumChain :: error', error);
			// switch (error.code) {
			// 	case EMetamaskError.CHAIN_NOT_ADDED:
			// 		this.__log('trySwitchNetwork :: metamaskApi.addEthereumChain', networkConfig);
			// 		await metamaskApi.addEthereumChain(networkConfig);
			// 		return;
			// 	case EMetamaskError.REJECT_REQUEST:
			// 		throw 'Switch to waves network is rejected';
			// 	default:
			// 		throw error;
			// }
		}
	}

	private async signOneTx(tx: SignerTx): Promise<any> {
		if(tx.type == TRANSACTION_TYPE.TRANSFER) {
			let sign;

			if(tx.assetId === 'WAVES' || tx.assetId === undefined) {
				tx.assetId = null;
			}

			this.__log('signOneTx :: transfer :', tx);
			if (tx.assetId === null) {
				this.__log('signOneTx :: transfer waves');
				sign = await metamaskApi.transferWaves(
					wavesAddress2eth(tx.recipient),
					String(tx.amount)
				);
				this.__log('signOneTx :: transfer waves :: result :', sign);
			} else {
				this.__log('signOneTx :: transfer asset');
				const txInfo = await metamaskApi.transferAsset(
					wavesAddress2eth(tx.recipient),
					wavesAsset2Eth(tx.assetId),
					String(tx.amount)
				);
				this.__log('signOneTx :: transfer asset :: result :', txInfo);
				sign = txInfo.hash;
			}

			const result = {
				...tx,
				id: ethTxId2waves(sign.slice(2))
			};

			this.__log('signOneTx :: result :', result);
			return result;

		} else if (tx.type == TRANSACTION_TYPE.INVOKE_SCRIPT) {
			const txInvoke = tx;
			const call = txInvoke.call!;
			const fnName = call.function;
			const dappAddress = txInvoke.dApp;

			const contract = await metamaskApi.createContract(dappAddress, this._connectOptions!.NODE_URL);

			const abi = findInvokeAbiByName(contract.abi, fnName);
			const paramsValues = serializeInvokeParams(call.args, abi!.inputs);
			const payments = formatPayments(txInvoke.payment || []);

			this.__log('signOneTx :: invoke', tx, fnName, paramsValues, payments);
			const txInfo = await contract.contract[fnName](
				...paramsValues,
				payments
			);
			this.__log('signOneTx :: invoke result :', tx, fnName, paramsValues, payments);
			const sign = txInfo.hash;

			const result = {
				...tx,
				id: ethTxId2waves(sign.slice(2))
			};

			this.__log('signOneTx :: result :', result);
			return result;
		}
	}

	public on<EVENT extends keyof AuthEvents>(
		event: EVENT,
		handler: Handler<AuthEvents[EVENT]>,
	): Provider {
		this.__log('on');
		console.error('Not implemented');
		return this;
	}

	public once<EVENT extends keyof AuthEvents>(
		event: EVENT,
		handler: Handler<AuthEvents[EVENT]>,
	): Provider{
		this.__log('once');
		console.error('Not implemented');
		return this;
	};

	public off<EVENT extends keyof AuthEvents>(
		event: EVENT,
		handler: Handler<AuthEvents[EVENT]>,
	): Provider {
		this.__log('off');
		console.error('Not implemented');
		return this;
	}

	private __log(tag: string, ...args) {
		if (this._config.debug) {
			console.log(`ProviderMetamask :: ${tag} :`, ...args);
		}
	}

}
