import { mergeConfigs } from '../config/helpers';
import { Context, Args } from '../interfaces';

export type CreateContextOptions = {
	config: any;
	cmd: string;
	args: Args;
}

export function createContext({ config, cmd, args }: CreateContextOptions): Context {
	const immutableConfig = Object.freeze(mergeConfigs({}, config));
	const immutableCmd = "" + cmd;
	const immutableArgs = Object.freeze(mergeConfigs({}, args)) as Args;

	return {
		config: immutableConfig,
		cmd: immutableCmd,
		args: immutableArgs,
		local: {},
		error: undefined,
	};
}
