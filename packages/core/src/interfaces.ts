import { EventType } from './eventbus/constants';
import { TunerEventBus } from './eventbus';

// Config types
// @TODO: Add correct config type
export type Config = any;

// Context types
export type ContextError = {
	exception: Error;
	original: Error;
	code: string;
	description?: string;
}

export type Args = {
	_: readonly string[];
	readonly [flag: string]: any;
}

export type Context = {
	config: Record<string, any>;
	cmd: string;
	args: Args;
	local: any;
	error?: ContextError;
}

// Event types
export type TunerEventType = typeof EventType;

export type TunerEventData = string | Error | Record<string, any> | undefined;

export type TunerEvent<T extends TunerEventData> = {
	task?: string;
	context: Context;
	data: T;
}

export type TunerEventListener<T extends TunerEventData> = (event: TunerEvent<T>) => void;

// Task types
export type TaskTools = {
	eventBus: TunerEventBus;
}
export type Task = (ctx: Context, utils: TaskTools) => void | Promise<any>;
export type TaskModule = {
	task: Task;
	description?: string | Record<string, string>;
}

// Runner types
export type Runner = {
	eventBus: TunerEventBus;
	context: Context;
}
