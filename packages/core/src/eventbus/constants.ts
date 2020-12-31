export const EventType = {
	EVENT_COMMAND_START: 'command-start',
	EVENT_COMMAND_FINISH: 'command-finish',
	EVENT_COMMAND_ERROR: 'command-error',
	EVENT_COMMAND_FINALLY: 'command-finally',
	EVENT_TASK_START: 'task-start',
	EVENT_TASK_MESSAGE: 'task-message',
	EVENT_TASK_OUTPUT: 'task-output',
	EVENT_TASK_INPUT: 'task-input',
	EVENT_TASK_FINISH: 'task-finish',
	EVENT_TASK_ERROR: 'task-error',
	EVENT_TASK_FINALLY: 'task-finally',
} as const;
