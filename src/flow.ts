// @ts-nocheck
import { ethers } from 'ethers';

const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any');
const bankAbi = '' // node api js GET /eth/abi/{wavesaddress}
const bytecode = "0x";

const bankFactory = new ethers.ContractFactory(
	bankAbi,
	bytecode,
	ethersProvider.getSigner(),
);

const ETH_ADDRESS = "0xa8138A5051968CEC17F186D14A9A8aCE9372a71f";
const contract = await bankFactory.attach(ETH_ADDRESS);

const invokeTx = {};

const fnName = invokeTx.call.name;
const fnArgs = invokeTx.call.args;
const payments = [];

const result = await contract[fnName](
	...fnArgs,
	payments
);

const wavesaddress = '3P5Bfd58PPfNvBM2Hy8QfbcDqMeNtzg7KfP'
const url = `https://devnet1-htz-nbg1-4.wavesnodes.com/eth/abi/${wavesaddress}`;

fetch(url)
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		console.log(data);
	});

/*
		const ETH_ADDRESS = "0xa8138A5051968CEC17F186D14A9A8aCE9372a71f";

		3P5Bfd58PPfNvBM2Hy8QfbcDqMeNtzg7KfP

		3FEVXxz656kaC24vh3r25eXNY64QSqX9ZFg

		test dApp
		3F4bY4PsS8E1tShx9ruSYthie3uzYiSffSv

*/
