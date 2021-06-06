import cp from "child_process";
import path from "path";
import { getConfig } from './config';
import { createEventBus } from './eventbus';
import { createContext } from './context';
import { Runner, Args } from './interfaces';

export function init(args: Args): Runner {
	const config = getConfig();
	const eventBus = createEventBus();
	const context = createContext({ args, config });

	return {
		context,
		eventBus,
	};
}

export function run(cmd: string = "help", runner: Runner) {
	runner.context.cmd = cmd;
	runner.eventBus.emit("command-start", runner.eventBus.createEvent(runner.context));
	const procRunner = cp.fork(path.resolve(__dirname, "./task-runner.js"), [], { silent: true });

	procRunner.stdout!.addListener("data", (chunk: string) => {
		runner.eventBus.emit("task-output", runner.eventBus.createEvent(runner.context, chunk));
	});

	procRunner.stderr!.addListener("data", (error: string) => {
		runner.eventBus.emit("task-error", runner.eventBus.createEvent(runner.context, error));
	});
	
	procRunner.addListener("exit", (code: number) => {
		if (code === 0) {
			runner.eventBus.emit("command-finish", runner.eventBus.createEvent(runner.context));
		}
		runner.eventBus.emit("command-finally", runner.eventBus.createEvent(runner.context, code));
	});
	
	procRunner.addListener("message", (chunk: any) => {
		if (chunk.error) {
			const commandError = new Error(chunk.message);
			commandError.stack = chunk.stack;
			commandError.name = chunk.name;
			(commandError as any).type = chunk.type;
			(commandError as any).code = chunk.code;
			(commandError as any).data = chunk.data;
			(commandError as any).context = chunk.context;

			runner.eventBus.emit("command-error", runner.eventBus.createEvent(chunk.context, commandError));
		} else if (chunk.meta) {
			switch(chunk.meta) {
			case "task-start":
				runner.eventBus.emit("task-start", runner.eventBus.createEvent(chunk.context, chunk.context.task as string));
				break;
			case "task-finish":
				runner.eventBus.emit("task-finish", runner.eventBus.createEvent(chunk.context, chunk.context.task as string));
				break;
			case "task-update":
				runner.context = chunk.context;
				break;
			}
		} else {
			runner.eventBus.emit("task-message", runner.eventBus.createEvent(chunk.context, chunk.data));
		}
	});

	procRunner.send({ lifecycle: "run", context: runner.context });
}
