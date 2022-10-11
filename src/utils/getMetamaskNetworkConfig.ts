import { IMetamaskNetworkConfig } from '../Metamask.interface';
import { ConnectOptions } from '@waves/signer';

export const getMetamaskNetworkConfig = ({ NETWORK_BYTE, NODE_URL }: ConnectOptions): IMetamaskNetworkConfig | null => {
	let config: IMetamaskNetworkConfig | null;

	switch (NETWORK_BYTE) {
		case 87: config = METAMASK_NETWORK_CONFIG_WAVES_MAINNET; break;
		case 83: config = METAMASK_NETWORK_CONFIG_WAVES_STAGENET; break;
		case 84: config = METAMASK_NETWORK_CONFIG_WAVES_TESTNET; break;
		// case 67: config = METAMASK_NETWORK_CONFIG_WAVES_DEVNET; break;

		default: config = null;
	}

	// if there is custom node
	if (config && !config.rpcUrls[0].includes(NODE_URL)) {
		config = null;
	}

	return config;
};

const METAMASK_NETWORK_CONFIG_WAVES_MAINNET: IMetamaskNetworkConfig = {
	chainId: '0x' + (87).toString(16),
	chainName: 'Waves',
	nativeCurrency: { name: 'WAVES', symbol: 'WAVES', decimals: 18 },
	rpcUrls: ['https://nodes.wavesnodes.com/eth'],
	blockExplorerUrls: ['https://wavesexplorer.com'],
};

const METAMASK_NETWORK_CONFIG_WAVES_STAGENET: IMetamaskNetworkConfig = {
	chainId: '0x' + (83).toString(16),
	chainName: 'Waves stagenet',
	nativeCurrency: { name: 'WAVES', symbol: 'WAVES', decimals: 18 },
	rpcUrls: ['https://nodes-stagenet.wavesnodes.com/eth'],
	blockExplorerUrls: ['https://wavesexplorer.com/?network=stagenet'],
};

const METAMASK_NETWORK_CONFIG_WAVES_TESTNET: IMetamaskNetworkConfig = {
	chainId: '0x' + (84).toString(16),
	chainName: 'Waves testnet',
	nativeCurrency: { name: 'WAVES', symbol: 'WAVES', decimals: 18 },
	rpcUrls: ['https://testnode1.wavesnodes.com/eth'],
	blockExplorerUrls: ['https://wavesexplorer.com/?network=testnet'],
};

const makeCustomConfig = (chainId: number, nodeUrl: string): IMetamaskNetworkConfig => {
	const oUrl = new URL(nodeUrl);
	oUrl.pathname = '/eth';

	return {
		chainId: '0x' + (chainId).toString(16),
		chainName: 'Waves custom',
		nativeCurrency: { name: 'WAVES', symbol: 'WAVES', decimals: 18 },
		rpcUrls: [oUrl.toString()],
		blockExplorerUrls: ['https://wavesexplorer.com/custom'],
	}
};

// const METAMASK_NETWORK_CONFIG_WAVES_DEVNET: IMetamaskNetworkConfig = {
// 	chainId: '0x' + (67).toString(16),
// 	chainName: 'Waves devnet',
// 	nativeCurrency: { name: 'WAVES', symbol: 'WAVES', decimals: 18 },
// 	rpcUrls: ['https://devnet1-htz-nbg1-4.wavesnodes.com/eth'],
// 	blockExplorerUrls: ['https://wavesexplorer.com/custom'],
// };
