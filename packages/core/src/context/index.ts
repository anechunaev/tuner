import { mergeConfigs } from '../config/helpers';
import { Context, Args } from '../interfaces';

export type CreateContextOptions = {
	config: any;
	args: Args;
}

export function createContext({ config, args }: CreateContextOptions): Context {
	const immutableConfig = Object.freeze(mergeConfigs({}, config));
	const immutableArgs = Object.freeze(mergeConfigs({}, args)) as Args;

	return {
		config: immutableConfig,
		args: immutableArgs,
		local: {},
		error: undefined,
		cmd: "help",
		task: undefined,
	};
}
