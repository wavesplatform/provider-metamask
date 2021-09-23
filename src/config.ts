import {
    IProviderMetamaskConfig,
    IWavesConfig
} from './ProviderMetamask.interface';

export const DEFAULT_WAVES_CONFIG: IWavesConfig = {
    nodeUrl: 'https://nodes.wavesnodes.com',
    chainId: 67
};

export const DEFAULT_PROVIDER_CONFIG: IProviderMetamaskConfig = {
    debug: false,
    wavesConfig: DEFAULT_WAVES_CONFIG
};
