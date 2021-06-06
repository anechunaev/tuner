import { Context } from "@tuner/core/lib/interfaces";
import columnify from 'columnify';

export function template(context: Context): string {
	let message = "\n";
	// Add app banner

	// Show usage of tuner itself
	const shell = `\x1b[0;32m  $\x1b[0m`;

	const usage = [
		{
			start: shell,
			command: `${context.config.meta.name} <COMMAND>`,
		}
	];

	if (typeof context.config.commands.help !== "undefined") {
		const cmd = context.config.commands.help;

		if (Array.isArray(cmd.example)) {
			(cmd.example as string[]).forEach(example => {
				usage.push({
					start: shell,
					command: `${context.config.meta.name} ${example}`,
				});
			})
		} else {
			usage.push({
				start: shell,
				command: `${context.config.meta.name} ${cmd.example}`,
			});
		}
	}

	message += "Usage:\n" + columnify(usage, {
		config: {
			command: { maxWidth: 76 },
		},
		maxLineWidth: 80,
		showHeaders: false,
	}) + "\n\n";

	// Print info about available commands
	const commandsList = Object.keys(context.config.commands);

	const data = commandsList.map(cmd => {
		const info = context.config.commands[cmd];

		return {
			required: "\x1b[91m  " + (info.required ? "*" : " ") + "\x1b[0m",
			cmd: `\x1b[1m${cmd} \x1b[0m`,
			description: typeof info.description === "string" ? info.description : info.description[context.config.locale],
		};
	});

	message += "Commands:\n" + columnify(data, {
		config: {
			description: { maxWidth: 70 },
		},
		showHeaders: false,
	}) + "\n\n";

	return message;
}
