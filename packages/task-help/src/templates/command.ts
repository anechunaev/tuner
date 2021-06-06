import { Context } from "@tuner/core/lib/interfaces";
import columnify from 'columnify';

function getFormattedUsageExample(example: string, context: Context): string {
	return `  \x1b[0;32m$\x1b[0m ${context.config.meta.name} ${example}\n`;
}

export function template(context: Context): string {
	let message = "\n";

	const info = context.config.commands[context.args._[1]];

	if (typeof info !== "undefined") {
		const description = typeof info.description === "string" ? info.description : info.description[context.config.locale];
		message += description + "\n\n";
		message += `Usage:\n`;

		if (Array.isArray(info.example)) {
			(info.example as string[]).forEach(example => message += getFormattedUsageExample(example, context));
			message += "\n";
		} else {
			message += `${getFormattedUsageExample(info.example, context)}\n`;
		}

		if (Array.isArray(info.args) && info.args.length) {
			const data = info.args.map((arg: any) => ({
				required: "\x1b[91m  " + (arg.required ? "*" : " ") + "\x1b[0m",
				cmd: `\x1b[1m${arg.name} \x1b[0m`,
				description: typeof arg.description === "string" ? arg.description : arg.description[context.config.locale],
			}));
			message += "Arguments:\n" + columnify(data, {
				config: {
					description: { maxWidth: 70 },
				},
				showHeaders: false,
			}) + "\n\n";
		}

		if (Array.isArray(info.flags) && info.flags.length) {
			const data = info.flags.map((flag: any) => ({
				required: "\x1b[91m  " + (flag.required ? "*" : " ") + "\x1b[0m",
				cmd: `\x1b[1m${flag.short ? '-' + flag.short + ' ' : ''}--${flag.name} \x1b[0m`,
				description: typeof flag.description === "string" ? flag.description : flag.description[context.config.locale],
			}));
			message += "Flags:\n" + columnify(data, {
				config: {
					description: { maxWidth: 70 },
				},
				showHeaders: false,
			}) + "\n\n";
		}
	} else {
		message += `Could not find command "${context.args._[1]}". Try to use one of these:\n  ${Object.keys(context.config.commands).join("\n  ")}`;
	}

	return message;
}
