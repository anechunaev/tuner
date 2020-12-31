import { Runner } from '@tuner/core/lib/interfaces';

function ui(runner: Runner) {
	console.log('Using classic interface');

	runner.eventBus.on("command-start", ({ context }) => {
		console.log(`[CLI]: Command "${context.cmd}" started. Context: `, context);
	});

	runner.eventBus.on("task-start", () => {
		console.log(`[CLI]: Task started.`);
	});

	runner.eventBus.on("task-message", (data) => {
		console.log(`[CLI]: Task messsaged: "${data}"`);
	});

	runner.eventBus.on("task-finish", () => {
		console.log(`[CLI]: Task finished.`);
	});

	runner.eventBus.on("task-finally", () => {
		console.log(`[CLI]: Task finally.`);
	});

	runner.eventBus.on("command-finish", ({ context }) => {
		console.log(`[CLI]: Command "${context.cmd}" finished.`);
	});

	runner.eventBus.on("command-finally", ({ context }) => {
		console.log(`[CLI]: Command "${context.cmd}" finally.`);
	});
}

export default ui;
