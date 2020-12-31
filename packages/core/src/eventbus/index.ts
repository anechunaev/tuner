import { EventType } from './constants';
import { TunerEventListener, TunerEvent, TunerEventData, Context, TaskModule } from '../interfaces';

type EventTypeUnion = typeof EventType[keyof typeof EventType];
const listenersStore: Partial<Record<EventTypeUnion, TunerEventListener<undefined>[]>> = {};

Object.values(EventType).forEach((eventType) => {
	listenersStore[eventType as EventTypeUnion] = [];
})

export function on(eventType: typeof EventType.EVENT_COMMAND_ERROR, listener: TunerEventListener<Error>): void;
export function on(eventType: typeof EventType.EVENT_TASK_ERROR, listener: TunerEventListener<Error>): void;
export function on(eventType: typeof EventType.EVENT_TASK_MESSAGE, listener: TunerEventListener<any>): void;
export function on(eventType: typeof EventType.EVENT_TASK_OUTPUT, listener: TunerEventListener<string>): void;
export function on(eventType: typeof EventType.EVENT_TASK_INPUT, listener: TunerEventListener<any>): void;
export function on(eventType: typeof EventType.EVENT_COMMAND_START, listener: TunerEventListener<TaskModule | TaskModule[]>): void;
export function on(eventType: typeof EventType.EVENT_COMMAND_FINISH, listener: TunerEventListener<undefined>): void;
export function on(eventType: typeof EventType.EVENT_COMMAND_FINALLY, listener: TunerEventListener<undefined>): void;
export function on(eventType: typeof EventType.EVENT_TASK_START, listener: TunerEventListener<undefined>): void;
export function on(eventType: typeof EventType.EVENT_TASK_FINISH, listener: TunerEventListener<undefined>): void;
export function on(eventType: typeof EventType.EVENT_TASK_FINALLY, listener: TunerEventListener<undefined>): void;
export function on(eventType: any, listener: any): void {
	listenersStore[eventType as EventTypeUnion]?.push(listener);
}


export function off(eventType: typeof EventType.EVENT_COMMAND_ERROR, listener: TunerEventListener<Error>): void;
export function off(eventType: typeof EventType.EVENT_TASK_ERROR, listener: TunerEventListener<Error>): void;
export function off(eventType: typeof EventType.EVENT_TASK_MESSAGE, listener: TunerEventListener<any>): void;
export function off(eventType: typeof EventType.EVENT_TASK_OUTPUT, listener: TunerEventListener<string>): void;
export function off(eventType: typeof EventType.EVENT_TASK_INPUT, listener: TunerEventListener<any>): void;
export function off(eventType: typeof EventType.EVENT_COMMAND_START, listener: TunerEventListener<TaskModule | TaskModule[]>): void;
export function off(eventType: typeof EventType.EVENT_COMMAND_FINISH, listener: TunerEventListener<undefined>): void;
export function off(eventType: typeof EventType.EVENT_COMMAND_FINALLY, listener: TunerEventListener<undefined>): void;
export function off(eventType: typeof EventType.EVENT_TASK_START, listener: TunerEventListener<undefined>): void;
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
export function emit(eventType: typeof EventType.EVENT_TASK_MESSAGE, data: TunerEvent<any>): void;
export function emit(eventType: typeof EventType.EVENT_TASK_OUTPUT, data: TunerEvent<string>): void;
export function emit(eventType: typeof EventType.EVENT_TASK_INPUT, data: TunerEvent<any>): void;
export function emit(eventType: typeof EventType.EVENT_COMMAND_START, data: TunerEvent<undefined>): void;
export function emit(eventType: typeof EventType.EVENT_COMMAND_FINISH, data: TunerEvent<undefined>): void;
export function emit(eventType: typeof EventType.EVENT_COMMAND_FINALLY, data: TunerEvent<undefined>): void;
export function emit(eventType: typeof EventType.EVENT_TASK_START, data: TunerEvent<string>): void;
export function emit(eventType: typeof EventType.EVENT_TASK_FINISH, data: TunerEvent<undefined>): void;
export function emit(eventType: typeof EventType.EVENT_TASK_FINALLY, data: TunerEvent<undefined>): void;
export function emit(eventType: any, data: any) {
	listenersStore[eventType as EventTypeUnion]?.forEach(fn => fn(data));
}

export function createEvent<T extends TunerEventData>(ctx: Context, data?: T): TunerEvent<T>;
export function createEvent<T extends TunerEventData>(ctx: Context, data?: T, task?: string): TunerEvent<T> {
	return {
		context: ctx,
		task,
		// @TODO: Fix generic type
		data: data as any,
	};
}

// type ReplaceReturnType<T extends (...a: any) => any, R> = (...a: Parameters<T>) => R;
export type TunerEventBus = {
	on: typeof on;
	off: typeof off;
	emit: typeof emit;
	createEvent: typeof createEvent;
}

export function createEventBus() {
	const bus: TunerEventBus = {
		on,
		off,
		emit,
		createEvent,
	};

	return bus;
}
