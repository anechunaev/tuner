import { ContextError } from '../interfaces';

/**************************************/
/* TC#: Errors while running commands */
/**************************************/

// Error while loading command.
// Usually happend when there is wrong syntax in task or command file.
export const TC1 = (e: Error, cmd: string, taskName?: string): ContextError => {
	let exceptionText = `Cannot load command "${cmd}".`;
	if (taskName) {
		exceptionText += ` Error while importing task "${taskName}".`;
	} else {
		exceptionText += ` Error while importing task "${cmd}".`;
	}
	return {
		exception: new Error(exceptionText),
		original: e,
		code: 'TC1',
		description: exceptionText,
	};
};

// Error while running command.
// Usually there is runtime error caused by bug in a task source code.
export const TC2 = (e: Error, cmd: string, taskName?: string): ContextError => {
	let exceptionText = `Error while running command "${cmd}".`;
	if (taskName) {
		exceptionText += ` Task "${taskName}" was ended with error.`;
	}
	return {
		exception: new Error(exceptionText),
		original: e,
		code: 'TC2',
		description: exceptionText,
	};
};

// Error while async command running.
// Usually there is runtime error caused by bug in a task source code.
export const TC3 = (e: Error, cmd: string): ContextError => {
	const exceptionText = `Error in async task while running command "${cmd}".`;
	return {
		exception: new Error(exceptionText),
		original: e,
		code: 'TC3',
		description: exceptionText,
	};
};
