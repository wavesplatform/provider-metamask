import { action, makeObservable, observable } from 'mobx';

import { Signer, TypedData } from '@waves/signer';
import { ProviderMetamask } from "@waves/provider-metamask";

import { BaseStore } from './BaseStore';

const mock = {
	transfer: {
		recipient: '3F11ucZTFLBGrY3TpSmWH3tH4iaYRgLVvZV',
		amount: 500000,
		assetId: null,
		// feeAssetId: null
	},
	typedData: [
		{ type: 'boolean', key: 'boolean', value: true },
		{ type: 'integer', key: 'integer', value: 1234567890 },
		{ type: 'string', key: 'string', value: 'this is string' },
		{ type: 'binary', key: 'binary', value: '0x0000' }
	],
	orderData: {
		orderType: 'SELL',
		version: 4,
		assetPair: {
			amountAsset: 100000,
			priceAsset: 500000,
		},
		price: 100000,
		amount: 100000,
		timestamp: Date.now(),
		expiration: Date.now() + 29 * 24 * 60 * 60 * 1000,
		matcherFee: 300000,
		matcherPublicKey: '',
		senderPublicKey: '',
		proofs: [],
		matcherFeeAssetId: null,
		id: '',
	}
}

class MainStore extends BaseStore {

	private signer?: Signer;
	private provider?: any;

	@observable transferData?: string = '';
	@observable typedData?: string = '';
	@observable orderData?: string = '';

	@observable signTransferResult?: string = '';
	@observable signTypedDataResult?: string = '';
	@observable signOrderResult?: string = '';

	constructor() {
		super();

		makeObservable(this);

		this.transferData = JSON.stringify(mock.transfer, null, ' ');
		this.typedData = JSON.stringify(mock.typedData as TypedData[], null, ' ');
		this.orderData = JSON.stringify(mock.orderData, null, ' ');

		this.initSigner();
	}

	initSigner = async () => {
		const network = {
			nodeUrl: 'https://devnet1-htz-nbg1-4.wavesnodes.com',
			chainId:  'C'.charCodeAt(0)
		};

		this.signer = new Signer({ NODE_URL: network.nodeUrl });
		this.provider = new ProviderMetamask({
			debug: true,
			wavesConfig: {
				nodeUrl: network.nodeUrl,
				chainId: network.chainId
			}
		});

		await this.signer.setProvider(this.provider);
	}

	@action async sendTransfer() {
		const txData = JSON.parse(this.transferData!);

		await this.signer!.login();
		const result = await this.signer!.transfer(txData).broadcast() as any;

		this.signTransferResult = result.id;
	}

	@action async signCustomData() {
		const typedData = JSON.parse(this.typedData!);

		if (typedData) {
			await this.signer!.login();
			const result = await this.signer!.signTypedData(typedData);

			this.signTypedDataResult = result;
		}
	}

	@action async signOrder() {
		const orderData = JSON.parse(this.orderData!);

		await this.provider.login();
		this.signOrderResult = await this.provider.signOrder(orderData);
	}

	@action changeTransferData(json: string) {
		this.transferData = json;
	}

	@action changeTypedData(json: string) {
		this.typedData = json;
	}

	@action changeOrderData(json: string) {
		this.orderData = json;
	}

}

export { MainStore };
