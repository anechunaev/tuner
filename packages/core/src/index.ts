import { createEventBus } from './eventbus';
import { createContext } from './context';
import { getConfig } from './config';
import { Runner, Args } from './interfaces';
import parseArgs from 'minimist';

const callStack: string[] = [];

export function init(log = console.log): Runner {
	const config = getConfig();
	// log('@TODO: Validate config');
	// ...

	if (config.debug) log('[->]: Check for updates - async add command');
	if (config.autoupdate) {
		callStack.push('update');
	}

	if (config.debug) log('@TODO: Load commands list');
	// ...

	if (config.debug) log('[->]: Create event bus');
	const eventBus = createEventBus();

	if (config.debug) log('@TODO: Create context');
	const args: Args = parseArgs(process.argv.slice(2)) as Args;
	const context = createContext({ cmd: args._[0], args, config });
	callStack.push(context.cmd);

	if (config.debug) log('@TODO: Import current command', callStack);
	// ...

	if (config.debug) log('@TODO: Validate current command config');
	// ...

	return {
		eventBus,
		context,
	};
}

export async function run(runner: Runner, log = console.log) {
	const cmd = runner.context.cmd;
	const config = runner.context.config;

	if (config.debug) log(`[${cmd}]: @TODO: ⚡️ command-start`);
	runner.eventBus.emit("command-start" as any, runner.eventBus.createEvent(runner.context, cmd));

	if (config.debug) log(`[${cmd}]: @TODO: fork process`);
	// ...

	if (config.debug) log(`[${cmd}]: @TODO: Load tasks list`);
	// ...

	if (config.debug) log(`[${cmd}]: @TODO: Import tasks`);
	// ...

	if (config.debug) log(`[${cmd}]: @TODO: ⚡️ task-start`);
	runner.eventBus.emit("task-start" as any, runner.eventBus.createEvent(runner.context, cmd, 'testing-test'));

	if (config.debug) log(`[${cmd}]: @TODO: ⚡️ task-message`);
	function sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	async function delayedMessage() {
		runner.eventBus.emit("task-message" as any, runner.eventBus.createEvent<string>(runner.context, cmd, 'testing-test', 'Hello') as any);
		await sleep(2000);
		runner.eventBus.emit("task-message" as any, runner.eventBus.createEvent<string>(runner.context, cmd, 'testing-test', 'World') as any);
		await sleep(2000);
		runner.eventBus.emit("task-message" as any, runner.eventBus.createEvent<string>(runner.context, cmd, 'testing-test', 'Goodbye') as any);
	}
	await delayedMessage();

	if (config.debug) log(`[${cmd}]: @TODO: ⚡️ task-finish`);
	runner.eventBus.emit("task-finish" as any, runner.eventBus.createEvent(runner.context, cmd, 'testing-test'));

	if (config.debug) log(`[${cmd}]: @TODO: ⚡️ task-finally`);
	runner.eventBus.emit("task-finally" as any, runner.eventBus.createEvent(runner.context, cmd, 'testing-test'));

	if (config.debug) log(`[${cmd}]: @TODO: ⚡️ command-finish`);
	runner.eventBus.emit("command-finish" as any, runner.eventBus.createEvent(runner.context, cmd));

	if (config.debug) log(`[${cmd}]: @TODO: ⚡️ command-finally`);
	runner.eventBus.emit("command-finally" as any, runner.eventBus.createEvent(runner.context, cmd));
}

// init
// - validate config
// - check for updates - async add command
// - load commands list
// - create event bus
// - create context
// - import current command
// - validate current command config
// @return message bus

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
//   - on task-finish
//   - on task-error
//   - on task-finally
// - on command-finish
// - on command-error
// - on command-finally

// - on command-stdout
// - on command-stderr
// - on command-stdin
