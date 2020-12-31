import { Task } from '@tuner/core/lib/interfaces';
import columnify from 'columnify';


export const description = {
	en: "Show command info",
	ru: "Показать информацию о команде",
};

export const task: Task = (ctx, { eventBus }) => {
	let message = "";

	if (typeof ctx.args._[1] === "string") {
		// Show info about specific command

		const info = ctx.config.commands[ctx.args._[1]];

		if (typeof info !== "undefined") {
			const description = typeof info.description === "string" ? info.description : info.description[ctx.config.locale];
			message += description + "\n\n";
			message += `Usage:\n  \x1b[0;32m$\x1b[0m ${ctx.config.meta.name} ${info.example}\n\n`;

			if (Array.isArray(info.args) && info.args.length) {
				const data = info.args.map((arg: any) => ({
					required: "\x1b[91m  " + (arg.required ? "*" : " ") + "\x1b[0m",
					cmd: `\x1b[1m${arg.name} \x1b[0m`,
					description: typeof arg.description === "string" ? arg.description : arg.description[ctx.config.locale],
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
					description: typeof flag.description === "string" ? flag.description : flag.description[ctx.config.locale],
				}));
				message += "Flags:\n" + columnify(data, {
					config: {
						description: { maxWidth: 70 },
					},
					showHeaders: false,
				}) + "\n\n";
			}
		} else {
			message += `Could not find command "${ctx.args._[1]}". Try to use one of these:\n  ${Object.keys(ctx.config.commands).join("\n  ")}`;
		}
	} else {
		// Add app banner
		message += `TUNER (Based on ${ctx.config.meta.package}, v.${ctx.config.meta.version})\n\n`;
		message += `App that was made to do something cool\n\n`;

		// Show usage of tuner itself
		const shell = `\x1b[0;32m  $\x1b[0m`;

		const usage = [
			{
				start: shell,
				command: `${ctx.config.meta.name} <COMMAND>`,
			}
		];

		if (typeof ctx.config.commands.help !== "undefined") {
			const cmd = ctx.config.commands.help;

			usage.push({
				start: shell,
				command: `${ctx.config.meta.name} ${cmd.example}`,
			});
		}

		message += "Usage:\n" + columnify(usage, {
			config: {
				command: { maxWidth: 76 },
			},
			maxLineWidth: 80,
			showHeaders: false,
		}) + "\n\n";

		// Print info about available commands
		const commandsList = Object.keys(ctx.config.commands);

		const data = commandsList.map(cmd => {
			const info = ctx.config.commands[cmd];

			return {
				required: "\x1b[91m  " + (info.required ? "*" : " ") + "\x1b[0m",
				cmd: `\x1b[1m${info.name} \x1b[0m`,
				description: typeof info.description === "string" ? info.description : info.description[ctx.config.locale],
			};
		});

		message += "Commands:\n" + columnify(data, {
			config: {
				description: { maxWidth: 70 },
			},
			showHeaders: false,
		}) + "\n\n";
	}

	eventBus.emit("task-output", eventBus.createEvent(ctx, message));
}


/*

Tuner something something

Usage:
  $ tuner <COMMAND>
  $ tuner help <COMMAND>

Options:
  * COMMAND  Something something
    COMMAND  Something something








help - Shows info about specific command

  EXAMPLE:
	tuner help [COMMAND] [--FLAGS]
	
  ARGUMENTS:
	COMMAND  Specific command

  FLAGS:
    -a --args  List of command arguments
	





	*/
