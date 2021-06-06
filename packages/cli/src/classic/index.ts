import { Runner } from '@tuner/core/lib/interfaces';
// import { getColorBanner } from '../helpers/banner';

const c = {
	rs: "\u001b[0m",
	grey: "\u001b[30;1m",
	red: "\u001b[31m",
	magenta: "\u001b[35m",
	green: "\u001b[32m",
	yellow: "\u001b[33m"
};
function pad(n: number): string {
	return n < 10 ? `0${n}` : `${n}`;
}
function now() {
	const date = new Date();
	const today = `${date.getFullYear()}-${pad(date.getMonth())}-${pad(date.getDate())}`;
	const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
	return `${c.grey}${today} ${time}${c.rs}`;
}

function ui(runner: Runner) {
	// console.log(`\n${getColorBanner({ name: runner.context.config.meta.package, version: runner.context.config.meta.version, })}\n`);
	let cmdStart: any;

	runner.eventBus.on("command-start", ({ context }) => {
		cmdStart = process.hrtime.bigint();
		console.log(`${now()} Command ${c.yellow}${context.cmd}${c.rs} started.`);
	});

	runner.eventBus.on("task-start", ({ data }) => {
		console.log(`${now()} [${c.yellow}${data}${c.rs}] started`);
	});

	runner.eventBus.on("task-finish", ({ data }) => {
		console.log(`${now()} [${c.yellow}${data}${c.rs}] ${c.green}finished${c.rs}`);
	});

	runner.eventBus.on("task-message", ({ context, data }) => {
		console.log(`${now()} [${c.yellow}${context.task}${c.rs}] Incoming message: ${JSON.stringify(data)}`);
	});

	runner.eventBus.on("task-output", ({ context, data }) => {
		console.log(`${now()} [${c.yellow}${context.task}${c.rs}] STDOUT:\n${data}`);
	});

	runner.eventBus.on("task-error", ({ context, data }) => {
		console.log(`${now()} [${c.yellow}${context.task}${c.rs}] STDERR:\n${c.red}${data}${c.rs}`);
	});

	runner.eventBus.on("command-finish", ({ context }) => {
		console.log(`${now()} Command ${c.yellow}${context.cmd}${c.rs} ${c.green}finished successfully${c.rs}.`);
	});

	runner.eventBus.on("command-error", ({ context, data }) => {
		console.error(`${now()} Command ${c.yellow}${context.cmd}${c.rs} finished with error:`);
		console.error(`  Type: ${c.red}${(data as any)?.type || data?.name}${c.rs} [${c.grey}${(data as any)?.code}${c.rs}]`);
		console.error(`  Message: ${c.red}${data?.message}${c.rs}`);
		if (data?.stack) {
			console.error(`  Stack:`);
			const stackParts = data.stack.split("\n");
			for (let i = 1; i < stackParts.length; i++) {
				if (/\binternal\b/.test(stackParts[i])) {
					console.error(`  ${c.grey}${stackParts[i]}${c.rs}`);
				} else {
					console.error(`  ${c.red}${stackParts[i]}${c.rs}`);
				}
			}
		}
		process.exitCode = 1;
	});

	runner.eventBus.on("command-finally", () => {
		const ms = (process.hrtime.bigint() - cmdStart);
		const factor = BigInt(1000000);
		console.log(`${now()} Finished in ${c.magenta}${(Number(ms * BigInt(1000) / factor) / 1000)}${c.rs} ms`);
	});
}

export default ui;
