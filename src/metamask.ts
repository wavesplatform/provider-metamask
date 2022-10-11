import { ethers } from 'ethers';
import MetaMaskOnboarding from '@metamask/onboarding';
import metamaskDetectProvider from '@metamask/detect-provider';
import { wavesAddress2eth } from '@waves/node-api-js';

import {
	IMetamaskNetworkConfig,
	EthereumAddress,
	IAbi,
	IContractMeta,
	MetamaskSign,
	IAbiOrderModel,
	IAbiSignTypedDataModel
} from './Metamask.interface';

import { ABI_TRANSFER_CUSTOM_TOKEN } from './helpers';
import { toEthereumAmount } from './utils';

const BYTE_CODE = '0x';

const metamaskApi = {

	_accounts: [],
	_api: undefined, // todo api type

	api: async function(): Promise<any> {
		if (!this._api) {
			this._api = (await metamaskDetectProvider()) as any;
		}

		return this._api;
	},

	requestAccounts: async function(): Promise<string[]> {
		const ethereumApi = await this.api();

		try {
			const newAccounts = await ethereumApi.request({
				method: 'eth_requestAccounts',
			});

			this._accounts = newAccounts;

			return this._accounts;
			// onRequest(newAccounts);
		} catch (error) {
			console.error(error);
			throw 'Error requestAccounts';
		}
	},

	//
	getAccounts: async function(): Promise<EthereumAddress[]> {
		const ethereumApi = await this.api();

		try {
			const newAccounts = await ethereumApi.request({
				method: 'eth_accounts',
			});
	
			this._accounts = newAccounts;

			return this._accounts
		} catch (err) {
			console.error(err);
			throw err;
		}
	},

	addEthereumChain: async function(networkConfig: IMetamaskNetworkConfig): Promise<void> {
		const ethereumApi = await this.api();

		try {
			await ethereumApi.request({
				method: 'wallet_addEthereumChain',
				params: [networkConfig],
			});
		} catch (err) {
			throw err;
		}
	},

	switchEthereumChain: async function(networkConfig: IMetamaskNetworkConfig): Promise<void> {
		const ethereumApi = await this.api();

		try {
			await ethereumApi.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: networkConfig.chainId }],
			});
		} catch (err) {
			throw err;
		}
	},

	createContract: async function(wavesaddress: string, nodeUrl: string): Promise<IContractMeta> {
		const ethereumApi = await this.api();
		const ethersProvider = new ethers.providers.Web3Provider(ethereumApi, 'any');

		const ethAddress = wavesAddress2eth(wavesaddress);
		const oUrl = new URL(nodeUrl);

		oUrl.pathname = `/eth/abi/${wavesaddress}`;

		// todo to node-api-js
		const response = await fetch(oUrl.toString());
		const data = await response.json();

		if(data.error) {
			throw data;
		}

		const bankAbi: IAbi[] = data;
		const bankFactory = new ethers.ContractFactory(
			bankAbi,
			BYTE_CODE,
			ethersProvider.getSigner(),
		);

		const contract = await bankFactory.attach(ethAddress);

		return {
			contract,
			abi: bankAbi
		};
	},

	/* sendEIP1559 */
	async transferWaves(recipient: EthereumAddress, amount: string): Promise<MetamaskSign> {
		const ethereumApi = await this.api();

		const WAVES_DECIMALS = 8;
		const ethAmount = toEthereumAmount(Number(amount), WAVES_DECIMALS);
		const amountInHex = `0x${ethAmount.toString(16)}`;

		const from = this._accounts[0];
		const params = {
			from: from,
			to: recipient,
			value: amountInHex,
			// gasLimit: '0x5028',
			// maxFeePerGas: '0x2540be400',
			// maxPriorityFeePerGas: '0x3b9aca00',
		};

		const result: MetamaskSign = await ethereumApi.request({
			method: 'eth_sendTransaction',
			params: [params],
		});

		return result;
	},

	// async transferAsset(recipient: string, ethAssetId: string, amount: string): Promise<any> {
	// 	const ethereumApi = await this.api();
	// 	const from = this._accounts[0];
	// 	const ethersProvider = new ethers.providers.Web3Provider(ethereumApi, 'any');

	// 	const hstContract = new ethers.Contract(
	// 		ethAssetId,
	// 		ABI_TRANSFER_CUSTOM_TOKEN,
	// 		ethersProvider.getSigner(),
	// 	);

	// 	const result = await hstContract.transfer(
	// 		recipient,
	// 		amount,
	// 		{
	// 		  from: from,
	// 		}
	// 	);

	// 	return result;
	// },

	async transferAsset(recipient: string, ethAssetId: string, amount: string): Promise<any> {
		const ethereumApi = await this.api();
		const from = this._accounts[0];

		const ethersProvider = new ethers.providers.Web3Provider(ethereumApi, 'any');

		const hstFactory = new ethers.ContractFactory(
			ABI_TRANSFER_CUSTOM_TOKEN,
			BYTE_CODE,
			ethersProvider.getSigner(),
		);

		const contract = await hstFactory.attach(ethAssetId);

		const result = await contract.transfer(
			recipient,
			amount,
			{
				from: from,
			}
		);

		return result;
	},

	signOrder: async function(order: IAbiOrderModel): Promise<MetamaskSign> {
		return this.signTypedDataV4(JSON.stringify(order));
	},

	signTypedDataV4: async function(data: string): Promise<MetamaskSign> {
		const ethereumApi = await this.api();
		const from = this._accounts[0];

		const sign = await ethereumApi.request({
			method: 'eth_signTypedData_v4',
			params: [from, data],
		});

		return sign;
	},

	signTypedData: async function(data: IAbiSignTypedDataModel): Promise<MetamaskSign> {
		const ethereumApi = await this.api();
		const from = this._accounts[0];

		const sign = await ethereumApi.request({
			method: 'eth_signTypedData_v4',
			params: [from, data],
		});

		return sign;
	},

	// getEncryptionPublicKey: async function(ethAddress) {
	// 	try {
	// 		const result = await ethereumApi.request({
	// 			method: 'eth_getEncryptionPublicKey',
	// 			params: [ethAddress],
	// 		});
	// 		return result;
	// 	} catch (err) {
	// 		throw err;
	// 	}
	// },

	// requestPermissions: async function() {
	// const ethereumApi = await this.api();
	// 	try {
	// 		const permissionsArray = await ethereumApi.request({
	// 			method: 'wallet_requestPermissions',
	// 			params: [{ eth_accounts: {} }],
	// 		});

	// 		return permissionsArray;
	// 	} catch (err) {
	// 		console.error(err);
	// 		throw err;
	// 	}
	// },

	// getPermissions: async function() {
	// const ethereumApi = await this.api();
	// 	try {
	// 		const permissionsArray = await ethereumApi.request({
	// 			method: 'wallet_getPermissions',
	// 		});

	// 		return permissionsArray;
	// 	} catch (err) {
	// 		console.error(err);
	// 		throw err;
	// 	}
	// },

	// sendTransaction: async function(transaction: any): Promise<MetamaskSign> {
	// const ethereumApi = await this.api();
	// 	const transactionParameters = {
	// 		nonce: '0x00', // ignored by MetaMask
	// 		gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
	// 		gas: '0x2710', // customizable by user during MetaMask confirmation.
	// 		to: '0x0000000000000000000000000000000000000000', // Required except during contract publications.
	// 		from: ethereumApi.selectedAddress, // must match user's active address.
	// 		value: '0x00', // Only required to send ether to the recipient from the initiating external account.
	// 		data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
	// 		chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
	// 	};

	// 	// txHash is a hex string
	// 	// As with any RPC call, it may throw an error
	// 	const txHash = await ethereumApi.request({
	// 		method: 'eth_sendTransaction',
	// 		params: [transactionParameters],
	// 	});

	// 	return txHash;
	// 	// ethereumApi
	// 	//     .request({
	// 	//         method: 'eth_sendTransaction',
	// 	//         params: [transactionParameters],
	// 	//     })
	// 	//     .then((result) => {
	// 	//         // The result varies by RPC method.
	// 	//         // For example, this method will return a transaction hash hexadecimal string on success.
	// 	//     })
	// 	//     .catch((error) => {
	// 	//         // If the request fails, the Promise will reject with an error.
	// 	//     });
	// },

}

export const isMetaMaskInstalled = () => MetaMaskOnboarding.isMetaMaskInstalled();

export default metamaskApi;
