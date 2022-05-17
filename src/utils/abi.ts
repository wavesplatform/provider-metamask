import { IAbi } from '../Metamask.interface';

export const findInvokeAbiByName = (abiList: IAbi[], name): IAbi | undefined => {
	let abi: IAbi | undefined= abiList.find((item) => {
		return item.name === name;
	});

	return abi;
};
