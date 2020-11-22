import { EventType } from './constants';
import { TunerEventListener, TunerEvent, Context } from '../interfaces';

type EventTypeUnion = typeof EventType[keyof typeof EventType];
const listenersStore: Partial<Record<EventTypeUnion, TunerEventListener<undefined>[]>> = {};

Object.values(EventType).forEach((eventType) => {
	listenersStore[eventType as EventTypeUnion] = [];
})

export function on(eventType: typeof EventType.EVENT_COMMAND_ERROR, listener: TunerEventListener<Error>): void;
export function on(eventType: typeof EventType.EVENT_TASK_ERROR, listener: TunerEventListener<Error>): void;
export function on(eventType: typeof EventType.EVENT_COMMAND_MESSAGE, listener: TunerEventListener<string>): void;
export function on(eventType: typeof EventType.EVENT_COMMAND_STDERR, listener: TunerEventListener<string>): void;
export function on(eventType: typeof EventType.EVENT_COMMAND_STDIN, listener: TunerEventListener<string>): void;
export function on(eventType: typeof EventType.EVENT_COMMAND_STDOUT, listener: TunerEventListener<string>): void;
export function on(eventType: typeof EventType.EVENT_TASK_MESSAGE, listener: TunerEventListener<string>): void;
export function on(eventType: typeof EventType.EVENT_COMMAND_FINISH, listener: TunerEventListener<undefined>): void;
export function on(eventType: typeof EventType.EVENT_COMMAND_FINALLY, listener: TunerEventListener<undefined>): void;
export function on(eventType: typeof EventType.EVENT_TASK_FINISH, listener: TunerEventListener<undefined>): void;
export function on(eventType: typeof EventType.EVENT_TASK_FINALLY, listener: TunerEventListener<undefined>): void;
export function on(eventType: any, listener: any): void {
	listenersStore[eventType as EventTypeUnion]?.push(listener);
}


export function off(eventType: typeof EventType.EVENT_COMMAND_ERROR, listener: TunerEventListener<Error>): void;
export function off(eventType: typeof EventType.EVENT_TASK_ERROR, listener: TunerEventListener<Error>): void;
export function off(eventType: typeof EventType.EVENT_COMMAND_MESSAGE, listener: TunerEventListener<string>): void;
export function off(eventType: typeof EventType.EVENT_COMMAND_STDERR, listener: TunerEventListener<string>): void;
export function off(eventType: typeof EventType.EVENT_COMMAND_STDIN, listener: TunerEventListener<string>): void;
export function off(eventType: typeof EventType.EVENT_COMMAND_STDOUT, listener: TunerEventListener<string>): void;
export function off(eventType: typeof EventType.EVENT_TASK_MESSAGE, listener: TunerEventListener<string>): void;
export function off(eventType: typeof EventType.EVENT_COMMAND_FINISH, listener: TunerEventListener<undefined>): void;
export function off(eventType: typeof EventType.EVENT_COMMAND_FINALLY, listener: TunerEventListener<undefined>): void;
export function off(eventType: typeof EventType.EVENT_TASK_FINISH, listener: TunerEventListener<undefined>): void;
export function off(eventType: typeof EventType.EVENT_TASK_FINALLY, listener: TunerEventListener<undefined>): void;
export function off(eventType: any, listener: any): void {
	const listenerIndex = listenersStore[eventType as EventTypeUnion]?.indexOf(listener);

	if (typeof listenerIndex === 'undefined' || listenerIndex < 0) {
		return;
	}

	delete listenersStore[eventType as EventTypeUnion];
	return;
}


export function emit(eventType: typeof EventType.EVENT_COMMAND_ERROR, data: TunerEvent<Error>): void;
export function emit(eventType: typeof EventType.EVENT_TASK_ERROR, data: TunerEvent<Error>): void;
export function emit(eventType: typeof EventType.EVENT_COMMAND_MESSAGE, data: TunerEvent<string>): void;
export function emit(eventType: typeof EventType.EVENT_COMMAND_STDERR, data: TunerEvent<string>): void;
export function emit(eventType: typeof EventType.EVENT_COMMAND_STDIN, data: TunerEvent<string>): void;
export function emit(eventType: typeof EventType.EVENT_COMMAND_STDOUT, data: TunerEvent<string>): void;
export function emit(eventType: typeof EventType.EVENT_TASK_MESSAGE, data: TunerEvent<string>): void;
export function emit(eventType: typeof EventType.EVENT_COMMAND_FINISH, data: TunerEvent<undefined>): void;
export function emit(eventType: typeof EventType.EVENT_COMMAND_FINALLY, data: TunerEvent<undefined>): void;
export function emit(eventType: typeof EventType.EVENT_TASK_FINISH, data: TunerEvent<undefined>): void;
export function emit(eventType: typeof EventType.EVENT_TASK_FINALLY, data: TunerEvent<undefined>): void;
export function emit(eventType: any, data: any) {
	listenersStore[eventType as EventTypeUnion]?.forEach(fn => fn(data));
}

export function createEvent<T extends string | Error | undefined>(ctx: Context, cmd: string, task?: string, data?: T): TunerEvent<T> {
	return {
		context: ctx,
		cmd,
		task,
		// @TODO: Fix generic type
		data: data as any,
	};
}

type ReplaceReturnType<T extends (...a: any) => any, R> = (...a: Parameters<T>) => R;
export type TunerEventBus = {
	on: ReplaceReturnType<typeof on, TunerEventBus>;
	off: ReplaceReturnType<typeof off, TunerEventBus>;
	emit: ReplaceReturnType<typeof emit, TunerEventBus>;
	createEvent: typeof createEvent;
}

export function createEventBus() {
	const bus: TunerEventBus = {
		on(...args) { on(...args); return bus; },
		off(...args) { off(...args); return bus; },
		emit(...args) { emit(...args); return bus; },
		createEvent(...args) { return createEvent(...args); },
	};

	return bus;
}
