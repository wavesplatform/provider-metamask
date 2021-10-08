import { IWavesConfig, IProviderMetamaskConfig } from '../ProviderMetamask.interface';

export const DEFAULT_WAVES_CONFIG: IWavesConfig = {
    chainId: 87,
    nodeUrl: 'https://nodes.wavesnodes.com',
};

export const DEFAULT_PROVIDER_CONFIG: IProviderMetamaskConfig = {
    debug: false,
    wavesConfig: DEFAULT_WAVES_CONFIG,
}
