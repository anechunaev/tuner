export type NestedArray<El> = El | NestedArray<El>[];

export type NestedArrayIterator<In, Out, Res = NestedArray<Out>> = (el: NestedArray<In>) => Res;

export function nestedArrayIteratorConstructor<In, Out, Res = NestedArray<Out>[]>(
	iterationFunction: (
		src: NestedArray<In>[],
		callback: NestedArrayIterator<In, Res>
	) => Res,
	nestedArray: NestedArray<In>,
	predicate: NestedArrayIterator<In, Out, Res>,
): Res {
	if (Array.isArray(nestedArray)) {
		return iterationFunction(
			nestedArray,
			(el) => nestedArrayIteratorConstructor(iterationFunction, el, predicate)
		);
	}
	return predicate(nestedArray);
}

const defaultMapper = <I, O>(arr: I[], pred: (n: I) => O) => Array.prototype.map.call(arr, pred);
const defaultWalker = <I, O>(arr: I[], pred: (n: I) => O) => Array.prototype.forEach.call(arr, pred);

export function nestedArrayMapper<In, Out>(src: NestedArray<In>, callback: NestedArrayIterator<In, Out>): NestedArray<Out> {
	// TODO: fix default mapper type
	return nestedArrayIteratorConstructor<In, Out, NestedArray<Out>>(defaultMapper as any, src, callback);
}

export function nestedArrayWalker<In>(src: NestedArray<In>, callback: NestedArrayIterator<In, void, void>): void {
	nestedArrayIteratorConstructor<In, void, void>(defaultWalker, src, callback);
}
