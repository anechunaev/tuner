import path from 'path';
import fs from 'fs';
import * as Constants from './constants';
import { mergeConfigs } from './helpers';
import yaml from 'js-yaml';
import { nestedArrayMapper } from '../tools';

const getTaskFullPath = (configDir: string, task: string) => {
	if (task[0] === '.' || task[0] === '/') {
		return path.resolve(configDir, task);
	} else {
		return require.resolve(task);
	}
}

export function resolvePathsInConfig<T extends Record<string, any>>(config: T, configDir: string): T {
	if (config === null || typeof config === 'undefined') return config;

	const newConfig = Object.assign({}, config);

	if (typeof config.commands !== 'undefined') {
		Object.keys(config.commands).forEach(cmd => {
			// TODO: move to errors list
			const errorTaskPath = new Error(`Error: Task should be a string or array of strings. Check command "${cmd}".`);

			// TODO: do something less stupid instead
			switch(true) {
			case Array.isArray(config.commands[cmd].tasks):
				config.commands[cmd].tasks = nestedArrayMapper(
					config.commands[cmd].tasks,
					(task) => getTaskFullPath(configDir, task),
				);
				break;
			case typeof config.commands[cmd].tasks === "string":
				config.commands[cmd].tasks = [getTaskFullPath(configDir, config.commands[cmd].tasks)];
				break;
			default:
				throw errorTaskPath;
			}
		});
	}

	return newConfig;
}

export function getConfig() {
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
	let config: Record<string, any> = {
		meta: {
			package: Constants.PACKAGE.name,
			version: Constants.PACKAGE.version,
			name: Constants.APP_NAME,
		},
	};

	// Deep merge all available configs
	[...files.values()].reverse().forEach(entry => {
		let resolvedConfig = {};

		if (path.extname(entry) === '.js' || path.extname(entry) === '.json') {
			resolvedConfig = require(entry);
		} else if (path.extname(entry) === '.yaml' || path.extname(entry) === '.yml') {
			const yamlConfig = yaml.safeLoad(fs.readFileSync(entry, 'utf8'), { filename: entry });

			if (typeof yamlConfig === 'object' && yamlConfig !== null) {
				resolvedConfig = yamlConfig;
			}
		}

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
