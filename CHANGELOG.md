# Changelog

provider-metamask changelog

## [1.1.6]
	- Fix: Change testnet url to https://nodes-testnet.wavesnodes.com

## [1.1.5]
	- Fix: Check network by Byte and Url (custom network) [GT-1191]

## [1.1.4]
	- Update: Use ethers.ContractFactory for transfer custom asset (reverted)
	- Core: Use metamaskDetectProvider from @metamask/detect-provider
	- Core: IOrderData interface added
	- Core: config.wavesConfig deprecated

## [1.1.3]
	- Fix: Adding network for new account [GT-531]
	- Fix: Return waves signature type of sign for tx type 4 (transfer) [GT-531]
	- Core: Add network before trying to switch

## [1.1.1]
	- Fix: Transfer custom asset amount. [LIBS-159]
	- Update: Remove publicKey from login. [LIBS-163]
	- Update: Switch network before broadcast transaction. [LIBS-162]

## [1.1.0]
	- Update: Use eth_signTypedData_v4 for sign typed data

## [1.0.9]
	- Update: supports priceMode: assetDecimals | fixedDecimals
	- Update: add validation for version, priceMode

## [1.0.8]
	- Fix: asset decimals when transfer WAVES

## [1.0.6]
	- Fix: assetId convers to ETH format
	- Update: order abi, signMessage abi, order.orderType uppercase
