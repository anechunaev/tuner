module.exports = {
	locale: "en",
	ci: !!process.env.CI,
	ui: !!process.env.CI ? "classic" : "dashboard",

	commands: {
		help: {
			tasks: "@tuner/task-help",
			description: {
				en: "Shows available commands or exact command description.",
				ru: "Выводит список доступных команд или описание конкретной команды.",
			},
			example: ["help [COMMAND]", "<COMMAND> --help", "<COMMAND> -h"],
			args: [
				{
					name: "COMMAND",
					required: false,
					description: {
						en: "If specified, shows how to use exact command.",
						ru: "Если параметр передан, показывает как использовать конкретную команду.",
					},
				},
			],
			flags: [],
		},
		"testing-test": {
			tasks: "@tuner/task-help",
			description: "If you are new to LINUX operating system and having trouble dealing with the command-line utilities provided by LINUX then you really need to know first of all about the help command which as its name says help you to learn about any built-in command.",
			args: [
				{
					name: "foo",
					required: false,
					description: "Hello foo!",
				},
				{
					name: "bar",
					required: true,
					description: "Hello bar!",
				},
			],
			flags: [
				{
					name: "test",
					short: "t",
					description: "Test flag",
					value: "num",
				},
			],
		},
	},

	plugins: [],

	// preset: "@tuner/preset-default",
	// secrets: {},

	// commands: [
	// 	// "@tuner/command-update", // self, dependencies|deps, devDependencies|ddeps, peerDependencies|pdeps, optionalDependencies|odeps, --major|minor|patch|build
	// 	// "@tuner/command-help",
	// 	// "@tuner/command-echo",
	// 	// "@tuner/command-config", // print, set, --global
	// ],
};
