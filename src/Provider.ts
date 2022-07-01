// import MetaMaskOnboarding from '@metamask/onboarding';
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

import { IUser, IProviderMetamaskConfig, IOrderData } from './Provider.interface';
import { EMetamaskError, IAbiOrderModel, MetamaskSign, IAbiSignTypedDataModel } from './Metamask.interface';
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
import metamaskApi, { isMetaMaskInstalled } from './metamask'

export class ProviderMetamask implements Provider {
	public isSignAndBroadcastByProvider = true;
	public user: IUser | null = null;

	private _config: IProviderMetamaskConfig;
	private _connectPromisify: ReturnType<typeof promisify>;

	constructor(config?: IProviderMetamaskConfig) {
		if (!isMetaMaskInstalled()) {
			throw 'Metamask is not installed';
		}

		if (config?.wavesConfig?.chainId) {
			console.warn('ProviderMetamask: config.chainId is deprecated');
		}

		this._config = config || DEFAULT_PROVIDER_CONFIG;
		this._config.wavesConfig = { ...DEFAULT_WAVES_CONFIG, ...this._config.wavesConfig };

		this._connectPromisify = promisify();

		this.__log('constructor', this._config);
	}

	public async login(): Promise<UserData> {
		this.__log('login');

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
				address: ethAddress2waves(ethAddr, this._config.wavesConfig.chainId!), //todo check to get from MM
				statusCode: ''
			};

			this.__log('login :: ', this.user);

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
		this.__log('signMessage :: ', data);

		await this._connectPromisify.promise;
		await this.trySwitchNetwork();

		const chainId = this._config.wavesConfig.chainId!;

		const abiSignMessage = makeAbiSignMessageModel({
			chainId: chainId,
		}, { text: data });

		this.__log('signMessage :: metamaskApi.signMessage :: ', abiSignMessage);
		const result = await metamaskApi.signTypedDataV4(JSON.stringify(abiSignMessage));
		this.__log('signMessage :: result :: ', result);

		return result;
	}

	public async signTypedData(data: TypedData[]): Promise<MetamaskSign> {
		this.__log('signTypedData :: ', data);

		await this._connectPromisify.promise;
		await this.trySwitchNetwork();

		const validate = validateTypedData(data);
		if (validate.status === false) {
			throw new Error(validate.message);
		}

		const chainId = this._config.wavesConfig.chainId!;
		const abiSignTypedData: IAbiSignTypedDataModel = makeAbiSignTypedDataModel({
			chainId: chainId,
		}, data);

		this.__log('signTypedData :: metamaskApi.signTypedData ', abiSignTypedData);
		const result = await metamaskApi.signTypedDataV4(JSON.stringify(abiSignTypedData));
		this.__log('signTypedData :: result :: ', result);

		return result;
	}

	public async signOrder(orderData: IOrderData): Promise<MetamaskSign> {
		this.__log('signOrder :: ', orderData);

		await this._connectPromisify.promise;
		await this.trySwitchNetwork();

		const order = cloneObj(orderData);
		const chainId = this._config.wavesConfig.chainId!;

		order.matcherFeeAssetId = prepareAssetId(order.matcherFeeAssetId);
		order.assetPair.amountAsset = prepareAssetId(order.assetPair.amountAsset);
		order.assetPair.priceAsset = prepareAssetId(order.assetPair.priceAsset);

		const validate = validateOrder(order);
		if (validate.status === false) {
			throw new Error(validate.message);
		}

		if (order.orderType) {
			order.orderType = String(order.orderType).toUpperCase();
		}

		const abiOrderModel: IAbiOrderModel = makeAbiOrderModel({
			chainId: chainId,
		},{
			"version": order.version,
			"orderType": order.orderType,
			"matcherPublicKey": order.matcherPublicKey,
			"matcherFeeAssetId": order.matcherFeeAssetId,
			"amountAsset": order.assetPair.amountAsset,
			"priceAsset": order.assetPair.priceAsset,
			"matcherFee": order.matcherFee,
			"amount": order.amount,
			"price": order.price,
			"timestamp": order.timestamp,
			"expiration": order.expiration,
			"priceMode": toMetamaskPriceMode(order.priceMode),
		});

		this.__log('signOrder :: metamaskApi.signOrder :: ', abiOrderModel);
		const result = await metamaskApi.signTypedDataV4(JSON.stringify(abiOrderModel));
		this.__log('signOrder :: result :: ', result);

		return result;
	}

	public async connect(options: ConnectOptions): Promise<void> {
		this.__log('connect', options);

		this._config.wavesConfig.chainId = options.NETWORK_BYTE;
		this._connectPromisify.resolve();
	}

	private async trySwitchNetwork() {
		this.__log('trySwitchNetwork');

		const networkConfig = getMetamaskNetworkConfig(this._config.wavesConfig.chainId!);

		if(networkConfig == null) {
			this.__log('trySwitchNetwork :: skiped');
			return;
		}

		// try to switch on waves network or create it
		try {
			this.__log('trySwitchNetwork :: metamaskApi.switchEthereumChain', networkConfig);
			await metamaskApi.switchEthereumChain(networkConfig);
		} catch (err) {
			switch (err.code) {
				case EMetamaskError.CHAIN_NOT_ADDED:
					this.__log('trySwitchNetwork :: metamaskApi.switchEthereumChain', networkConfig);
					await metamaskApi.addEthereumChain(networkConfig);
					return;
				case EMetamaskError.REJECT_REQUEST:
					throw 'Switch to waves network is rejected';
			}

			throw err;
		}
	}

	private async signOneTx(tx: SignerTx): Promise<any> {
		const wavesConfig = this._config.wavesConfig;

		if(tx.type == TRANSACTION_TYPE.TRANSFER) {
			let sign;

			if(tx.assetId === 'WAVES' || tx.assetId === undefined) {
				tx.assetId = null;
			}

			this.__log('signOneTx :: transfer ', tx);
			if (tx.assetId === null) {
				sign = await metamaskApi.transferWaves(
					wavesAddress2eth(tx.recipient),
					String(tx.amount)
				);
			} else {
				console.log(tx.assetId, tx.recipient, wavesAsset2Eth(tx.assetId), wavesAddress2eth(tx.recipient));
				const txInfo = await metamaskApi.transferAsset(
					wavesAddress2eth(tx.recipient),
					wavesAsset2Eth(tx.assetId),
					String(tx.amount)
				);

				sign = txInfo.hash.slice(2);
			}

			const result = {
				...tx,
				id: sign
			};

			this.__log('signOneTx :: result :: ', result);
			return result;

		} else if (tx.type == TRANSACTION_TYPE.INVOKE_SCRIPT) {
			const txInvoke = tx;
			const call = txInvoke.call!;
			const fnName = call.function;
			const dappAddress = txInvoke.dApp;

			const contract = await metamaskApi.createContract(dappAddress, wavesConfig.nodeUrl);

			const abi = findInvokeAbiByName(contract.abi, fnName);
			const paramsValues = serializeInvokeParams(call.args, abi!.inputs);
			const payments = formatPayments(txInvoke.payment || []);

			this.__log('signOneTx :: invoke ', tx, fnName, paramsValues, payments);
			const txInfo = await contract.contract[fnName](
				...paramsValues,
				payments
			);

			const result = {
				...tx,
				id: ethTxId2waves(txInfo.hash.slice(2))
			};

			this.__log('signOneTx :: result :: ', result);
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
			console.log(`ProviderMetamask :: ${tag} : `, ...args);
		}
	}

}
