import { createContext } from '../context';
import * as Errors from '../errors/list';

import { Task, } from '../interfaces';

export async function runCommand(cmd: string, args: string[], config: Record<string, any>) {
	const context = createContext({ config, cmd, args });

	if (typeof config.commands[cmd] === 'undefined') {
		// @TODO validate config
		console.error('Error: Undefined command');
	} else {
		const tasks = [];
		
		if (typeof config.commands[cmd] === 'string') {
			try {
				tasks.push(require(config.commands[cmd]));
			} catch (e) {
				context.error = Errors.TC1(e, cmd);
			}
		} else if (Array.isArray(config.commands[cmd])) {
			if (context.error) return;

			config.commands[cmd].forEach((taskName: string) => {
				if (context.error) return;

				try {
					const task = require(config.tasks[taskName]);
					(task as any).__taskName = taskName;
					tasks.push(task);
				} catch (e) {
					context.error = Errors.TC1(e, cmd, taskName);
				}
			});
		} else {
			// @TODO validate config
			console.error('Error: Wrong command syntax in config');
		}

		if (!context.error) {
			const taskPromises: Promise<any>[] = [];
			tasks.forEach((task: { default: Task }) => {
				if (context.error) return;

				try {
					const returnObject: Promise<any> | void = task.default(context);
					if (typeof returnObject === 'object' && returnObject instanceof Promise) {
						(returnObject as any).__taskName = (task as any).__taskName;
						taskPromises.push(returnObject);
					}
				} catch (e) {
					context.error = Errors.TC2(e, cmd, (task as any).__taskName);
				}
			});

			if (taskPromises.length > 0) {
				try {
					await Promise.all(taskPromises);
				} catch (e) {
					context.error = Errors.TC3(e, cmd);
				}
			}
		}
	}

	// @TODO Error dump from context

	if (context.error) {
		const cred = config.ci ? '' : "\x1b[31m";
		const cdim = config.ci ? '' : "\x1b[2m";
		const creset = config.ci ? '' : "\x1b[0m";

		process.exitCode = 1;

		console.error(`${cred}[Error ${context.error.code}]${creset}: ${context.error.exception.message}`);

		if (context.error.original instanceof Error) {
			console.error(`${cdim + cred}${context.error.original.name}: ${creset + cred}${context.error.original.message}${creset}`);
		} else {
			console.error(`${cred}${context.error.original}${creset}`);
		}

		if (context.error.original.stack) {
			const stackParts = context.error.original.stack?.toString().split("\n");
			const parts = stackParts.slice(1, stackParts.length).map(part => {
				if (part.match(__filename) || /\(<anonymous>\)/.test(part)) {
					return `${cdim + cred}${part}${creset}`;
				}

				return `${cred}${part}${creset}`;
			});
			console.error(parts.join("\n"));
		}
	}
}
