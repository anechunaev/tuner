import path from 'path';
import fs from 'fs';
import * as Constants from './constants';
import { mergeConfigs } from './helpers';
import yaml from 'js-yaml';
// import { nestedArrayMapper } from '../tools';
import { Config, ConfigPresets } from '../interfaces';

const getModuleFullPath = (configDir: string, mod: string, preset?: ConfigPresets) => {
	if (mod[0] === '.' || mod[0] === '/') {
		return path.resolve(configDir, mod);
	} else {
		let presetArray: string[] | string[][] = [];
		if (typeof preset !== "undefined") {
			presetArray = Array.isArray(preset) ? preset.map(presetPath => [
				path.resolve(path.dirname(require.main!.filename), `./node_modules/${presetPath}/node_modules`),
				path.resolve(path.dirname(require.main!.filename), `../node_modules/${presetPath}/node_modules`),
			]) : [
				path.resolve(path.dirname(require.main!.filename), `./node_modules/${preset}/node_modules`),
				path.resolve(path.dirname(require.main!.filename), `../node_modules/${preset}/node_modules`),
			];
		}

		const paths = [
			path.resolve(path.dirname(require.main!.filename), './node_modules'),
			path.resolve(path.dirname(require.main!.filename), '../node_modules'),
			...presetArray,
			path.resolve(process.cwd(), './node_modules'),
		].flat();
		return require.resolve(mod, { paths });
	}
}

export function resolvePathsInConfig<T extends Config>(config: T, configDir: string): T {
	if (config === null || typeof config === 'undefined') return config;

	// If commands defined in current config
	if (typeof config.commands !== 'undefined') {
		let commands: any[] = [];
		if (typeof config.commands === "string") {
			commands = [config.commands];
		} else if (Array.isArray(config.commands)) {
			// TODO: Validate if commands are strings
			commands = config.commands;
		} else {
			throw new Error("Config Validation Error: `commands` property should be a string or array of strings");
		}

		config.commands = commands.map(command => getModuleFullPath(configDir, command, config.presets));
	}

	// If plugins defined in current config
	if (typeof config.plugins !== "undefined") {
		let plugins: any[] = [];
		if (typeof config.plugins === "string") {
			plugins = [config.plugins];
		} else if (Array.isArray(config.plugins)) {
			// TODO: validate if plugins are strings
			plugins = config.plugins;
		} else {
			throw new Error("Config Validation Error: `plugins` property should be a string or array of strings");
		}

		config.plugins = plugins.map(plugin => getModuleFullPath(configDir, plugin, config.presets));
	}

	return config;
}

export function getConfig(): Config {
	// Find all configs in system
	const files = Constants.PATHS_TO_SEARCH.reduce<Set<string>>((list, pathToSearch) => {
		Constants.CONFIG_FILE_NAMES.forEach(configPath => {
			const finalPath = path.resolve(pathToSearch, configPath);

			if (fs.existsSync(finalPath)) {
				list.add(finalPath);
			}
		});
		return list;
	}, new Set<string>());

	files.add(Constants.DEFAULT_CONFIG_PATH);

	// Set base config
	let config: Config = {
		meta: {
			package: Constants.PACKAGE.name,
			version: Constants.PACKAGE.version,
			name: Constants.APP_NAME,
		},
	};

	function resolveConfig(entry: string): any {
		let resolvedConfig: Config = {};

		if (path.extname(entry) === '.js' || path.extname(entry) === '.json') {
			resolvedConfig = require(entry);
		} else if (path.extname(entry) === '.yaml' || path.extname(entry) === '.yml') {
			const yamlConfig = yaml.safeLoad(fs.readFileSync(entry, 'utf8'), { filename: entry });

			if (typeof yamlConfig === 'object' && yamlConfig !== null) {
				resolvedConfig = yamlConfig;
			}
		}

		if (typeof resolvedConfig.presets === "string") {
			resolvedConfig.presets = [resolvedConfig.presets];
		}

		if (Array.isArray(resolvedConfig.presets)) {
			const presetPaths = resolvedConfig.presets.map(preset => getModuleFullPath(path.dirname(entry), preset));
			
			// load preset configs
		}
	}

	// Deep merge all available configs
	[...files.values()].reverse().forEach(entry => {
		

		config = mergeConfigs(config, resolvePathsInConfig(resolvedConfig, path.dirname(entry)));
	});

	const filesArray = Array.from(files);
	const projectPkgPath = path.resolve(process.cwd(), './package.json');

	if (fs.existsSync(projectPkgPath)) {
		const projectPkg = require(projectPkgPath);
		config = mergeConfigs(config, resolvePathsInConfig(projectPkg[Constants.APP_NAME], path.dirname(projectPkgPath)));

		if (typeof projectPkg[Constants.APP_NAME] !== "undefined") {
			filesArray.unshift(projectPkgPath);
		}
	}

	return config;
}
