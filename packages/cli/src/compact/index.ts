import { Runner } from '@tuner/core/lib/interfaces';

function ui(runner: Runner) {
	console.log('Using compact interface');

	runner.eventBus.on("command-start", ({ context }) => {
		console.log(`[CLI]: Command "${context.cmd}" started. Context: `, context);
	});

	runner.eventBus.on("task-start", ({ task }) => {
		console.log(`[CLI]: Task "${task}" started.`);
	});

	runner.eventBus.on("task-message", ({ task, data }) => {
		console.log(`[CLI]: Task "${task}" messsaged: "${data}"`);
	});

	runner.eventBus.on("task-finish", ({ task }) => {
		console.log(`[CLI]: Task "${task}" finished.`);
	});

	runner.eventBus.on("task-finally", ({ task }) => {
		console.log(`[CLI]: Task "${task}" finally.`);
	});

	runner.eventBus.on("command-finish", ({ context }) => {
		console.log(`[CLI]: Command "${context.cmd}" finished.`);
	});

	runner.eventBus.on("command-finally", ({ context }) => {
		console.log(`[CLI]: Command "${context.cmd}" finally.`);
	});
}

export default ui;
