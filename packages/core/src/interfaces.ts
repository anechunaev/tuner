import { EventType } from './eventbus/constants';
import { TunerEventBus } from './eventbus';

// Errors
export interface TunerInnerError extends Error {
	type: "TunerError";
	data?: any;
	code: string;
	arguments?: typeof Error.arguments;
	context: Context;
}
export interface TunerTaskError extends Error {
	type: "TaskError";
	data?: any;
	code: string;
	arguments?: typeof Error.arguments;
	context: Context;
}

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
	task?: string;
	args: Args;
	local: any;
	error?: ContextError;
}

// Event types
export type TunerEventType = typeof EventType;

export type TunerEventData = string | number | Error | Record<string, any> | undefined;

export type TunerEvent<T extends TunerEventData> = {
	task?: string;
	context: Context;
	data?: T;
}

export type TunerEventListener<T extends TunerEventData> = (event: TunerEvent<T>) => void;

// Task types
export type EmitInnerEvent = (event: any) => void;
export type Task = (args: { context: Context, emit: EmitInnerEvent }) => void | Promise<any>;
export type TaskModule = {
	task: Task;
	description?: string | Record<string, string>;
	name?: string;
}

// Runner types
export type Runner = {
	eventBus: TunerEventBus;
	context: Context;
}
