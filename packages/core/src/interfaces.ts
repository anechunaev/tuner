import { EventType } from './eventbus/constants';
import { TunerEventBus } from './eventbus';

// @TODO: Add correct config type
export type Config = any;

export type ContextError = {
	exception: Error;
	original: Error;
	code: string;
	description?: string;
}

export type Context = {
	config: Record<string, any>;
	cmd: string;
	args: readonly string[];
	local: any;
	error?: ContextError;
}

// @TODO: Add utils
export type Task = (ctx: Context, utils?: any) => void | Promise<any>;

export type TunerEventType = typeof EventType;

export type TunerEvent<T extends undefined | string | Error> = {
	task?: string;
	cmd: string;
	context: Context;
	data: T;
}

export type TunerEventListener<T extends undefined | string | Error> = (event: TunerEvent<T>) => void;


export type Runner = {
	eventBus: TunerEventBus;
	context: Context;
}
