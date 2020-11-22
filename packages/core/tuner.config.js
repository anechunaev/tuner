module.exports = {
	locale: "en",
	ci: !!process.env.CI,
	ui: !!process.env.CI ? "classic" : "dashboard",

	// preset: "@tuner/preset-default",
	// secrets: {},

	// commands: [
	// 	"@tuner/command-update", // self, dependencies|deps, devDependencies|ddeps, peerDependencies|pdeps, optionalDependencies|odeps, --major|minor|patch|build
	// 	"@tuner/command-help",
	// 	"@tuner/command-echo",
	// 	"@tuner/command-config", // print, set, --global
	// ],
	// tasks: [],
	// hooks: [],
};
