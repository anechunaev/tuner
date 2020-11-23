import { Runner } from '@tuner/core/lib/interfaces';

function ui(runner: Runner) {
	console.log('Using compact interface');

	runner.eventBus.on("command-start", ({ cmd, context }) => {
		console.log(`[CLI]: Command "${cmd}" started. Context: `, context);
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

	runner.eventBus.on("command-finish", ({ cmd }) => {
		console.log(`[CLI]: Command "${cmd}" finished.`);
	});

	runner.eventBus.on("command-finally", ({ cmd }) => {
		console.log(`[CLI]: Command "${cmd}" finally.`);
	});
}

export default ui;
