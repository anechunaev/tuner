import { mergeConfigs } from '../config/helpers';
import { Context } from '../interfaces';

export type CreateContextOptions = {
	config: any;
	cmd: string;
	args: string[];
}

export function createContext({ config, cmd, args }: CreateContextOptions): Context {
	const immutableConfig = Object.freeze(mergeConfigs({}, config));
	const immutableCmd = "" + cmd;
	const immutableArgs = [...args];

	return {
		config: immutableConfig,
		cmd: immutableCmd,
		args: immutableArgs,
		local: {},
		error: undefined,
	};
}
