import { init, run } from "@tuner/core";

const wrappedLog = (...args: any[]) => console.log(`\x1b[2m${args.map(e => e.toString()).join(' ')}\x1b[0m`);

const runner = init({}, wrappedLog);

runner.eventBus.on("command-start" as any, ({ cmd, context }) => {
	console.log(`[CLI]: Command "${cmd}" started. Context: `, context);
});

runner.eventBus.on("task-start" as any, ({ task }) => {
	console.log(`[CLI]: Task "${task}" started.`);
});

runner.eventBus.on("task-message" as any, ({ task, data }) => {
	console.log(`[CLI]: Task "${task}" messsaged: "${data}"`);
});

runner.eventBus.on("task-finish" as any, ({ task }) => {
	console.log(`[CLI]: Task "${task}" finished.`);
});

runner.eventBus.on("task-finally" as any, ({ task }) => {
	console.log(`[CLI]: Task "${task}" finally.`);
});

runner.eventBus.on("command-finish" as any, ({ cmd }) => {
	console.log(`[CLI]: Command "${cmd}" finished.`);
});

runner.eventBus.on("command-finally" as any, ({ cmd }) => {
	console.log(`[CLI]: Command "${cmd}" finally.`);
});

run(runner, wrappedLog);
