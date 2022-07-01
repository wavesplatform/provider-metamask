interface IPromisify<T = {}> {
	promise: Promise<any>;
	resolve: (v?: any) => void;
	reject: (e?: any) => void;
}

export const promisify = function promisify<Type>(): IPromisify<Type> {
	let resolve;
	let reject;

	const promise = new Promise((resolveFn, rejectFn) => {
		resolve = resolveFn;
		reject = rejectFn;
	});

	return {
		promise,
		resolve,
		reject,
	};
}
