import { createEventBus } from './eventbus';
import { createContext } from './context';
import { getConfig } from './config';
import { Runner, Args } from './interfaces';
import { nestedArrayMapper } from './tools';

let shouldSelfUpdate = false;

export function init(args: Args): Runner {
	const config = getConfig();

	// TODO: Validate config
	// ...

	// TODO: Check for updates - async add command
	if (config.autoupdate) {
		// TODO: check if update needed
		// ...
		// shouldSelfUpdate = true;
	}

	const eventBus = createEventBus();

	const context = createContext({ args, config });

	return {
		eventBus,
		context,
	};
}

export async function run(cmd: string, runner: Runner) {
	runner.context.cmd = cmd;
	const commandInfo = runner.context.config.commands[cmd];

	let index = 0;
	const requiredTaskList = nestedArrayMapper(commandInfo.tasks, (task) => {
		const exp = require(task);
		if (exp.id) return exp;

		exp.id = Number(++index);
		exp.path = task;
		return exp;
	});
	commandInfo.tasks = requiredTaskList;

	if (shouldSelfUpdate) {
		// TODO: add task before all current tasks
		// ...
		shouldSelfUpdate = false;
	}

	// TODO Validate current command config
	// ...

	runner.eventBus.emit("command-start", runner.eventBus.createEvent(runner.context, requiredTaskList));

	try {
		function walker(list: any): Promise<any> {
			if (Array.isArray(list)) {
				return Promise.all(list.map(
					(el) => walker(el)
				));
			} else {
				// TODO check if variables are defined
				const { task, id } = list;

				runner.eventBus.emit("task-start", runner.eventBus.createEvent(runner.context));

				return new Promise((resolve, reject) => {
					try {
						task(runner.context, { eventBus: runner.eventBus });
						runner.eventBus.emit("task-finish", runner.eventBus.createEvent(runner.context));
						resolve(id);
					} catch(taskExecutionError) {
						runner.eventBus.emit("task-error", runner.eventBus.createEvent(runner.context, taskExecutionError));
						reject(taskExecutionError);
					} finally {
						runner.eventBus.emit("task-finally", runner.eventBus.createEvent(runner.context));
					}
				});
			}
		}

		if (Array.isArray(requiredTaskList)) {
			for (let i = 0; i < requiredTaskList.length; i++) {
				const mod = requiredTaskList[i];
				await walker(mod);
			}
		} else {
			requiredTaskList.task(runner.context, { eventBus: runner.eventBus });
		}

		runner.eventBus.emit("command-finish", runner.eventBus.createEvent(runner.context));
	} catch(commandRunError) {
		runner.eventBus.emit("command-error", runner.eventBus.createEvent(runner.context, commandRunError));
	} finally {
		runner.eventBus.emit("command-finally", runner.eventBus.createEvent(runner.context));
	}
}

// run cmd loop
// - fork process
// - on command-start
// - load tasks list
// - import tasks
// - on command-message
// - loop:
//   - on task-start
//   - validate task config
//   - run task
//   - on task-message
//   - on task-input
//   - on task-output
//   - on task-finish
//   - on task-error
//   - on task-finally
// - on command-finish
// - on command-error
// - on command-finally

// - on command-stdout
// - on command-stderr
// - on command-stdin
