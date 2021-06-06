import { Context } from './interfaces';

type IncomingRequest = {
	lifecycle: "run";
	context: Context;
} | {
	lifecycle: "update";
	stdout?: string;
	stderr?: string;
};

if (typeof process.send === "function") {
	process.on("message", (req: IncomingRequest) => {
		let taskContext: Context = {} as Context;

		if (req.lifecycle === "run") {
			const { context } = req;
			taskContext = context;
			const { config, cmd } = taskContext;
			const cmdMeta = config.commands[cmd];

			if (typeof cmdMeta !== "undefined") {
				function walker(taskList: string[]) {
					if (taskList.length > 0) {
						const currentTaskId = taskList.shift()!;
						(new Promise<void>(async (resolve, reject) => {
							const taskModule = require(currentTaskId);
							taskContext.task = taskModule.name || currentTaskId;
							process.send!({
								meta: "task-update",
								context: taskContext,
							});
							process.send!({
								meta: "task-start",
								context: taskContext,
							});
							try {
								await taskModule.task({
									context: taskContext,
									emit: (msg: any) => process.send!({
										context: taskContext,
										data: msg,
									}),
								});
								resolve();
							} catch(err) {
								reject(err);
							}
							
						}))
							.then(() => {
								process.send!({
									meta: "task-finish",
									context: taskContext,
								});
								walker(taskList);
							})
							.catch((taskRunError) => {
								process.send!({
									error: true,
									name: taskRunError.name,
									message: taskRunError.message,
									data: taskRunError,
									code: "ETASKRUN",
									stack: taskRunError.stack,
									arguments: taskRunError.arguments,
									type: "TaskError",
									context: taskContext,
								});
								process.exitCode = process.exitCode ?? 1;
								walker([]);
							});
					} else {
						process.exit();
					}
				}
				walker(cmdMeta.tasks);
			} else {
				const taskNotFoundError = new Error(`Command "${cmd}" was not found.`);
				process.send!({
					error: true,
					name: taskNotFoundError.name,
					message: taskNotFoundError.message,
					data: null,
					code: "ETASKNOTFOUND",
					stack: taskNotFoundError.stack,
					arguments: undefined,
					type: "TunerError",
					context: taskContext,
				});
				process.exit(1);
			}
		}
	});
} else {
	throw new Error("This file should be executed in child process only. Use any available Tuner interface to run the task.")
}
