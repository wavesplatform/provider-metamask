import { EPriceMode } from '../Provider.interface';
import { EMetamaskPriceMode } from '../Metamask.interface';

export const toMetamaskPriceMode = (priceMode: EPriceMode | undefined): EMetamaskPriceMode => {
	switch (priceMode) {
		case EPriceMode.ASSET_DECIMALS:
			return EMetamaskPriceMode.ASSET_DECIMALS;
		case EPriceMode.FIXED_DECIMALS:
			return EMetamaskPriceMode.FIXED_DECIMALS;
		default:
			return EMetamaskPriceMode.FIXED_DECIMALS;
	}
}