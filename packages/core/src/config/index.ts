import path from 'path';
import fs from 'fs';
import * as Constants from './constants';
import { mergeConfigs } from './helpers';
import yaml from 'js-yaml';


export function resolvePathsInConfig<T extends Record<string, any>>(config: T, configDir: string): T {
	if (config === null || typeof config === 'undefined') return config;

	const newConfig = Object.assign({}, config);

	if (typeof config.commands !== 'undefined') {
		Object.keys(config.commands).forEach(cmd => {
			if (typeof config.commands[cmd] === 'string') {
				// @TODO: Add node modules resolve
				newConfig.commands[cmd] = path.resolve(configDir, config.commands[cmd]);
			}
		});
	}

	if (typeof config.tasks !== 'undefined') {
		Object.keys(config.tasks).forEach(task => {
			if (typeof config.tasks[task] === 'string') {
				// @TODO: Add node modules resolve
				newConfig.tasks[task] = path.resolve(configDir, config.tasks[task]);
			}
		});
	}

	return newConfig;
}

export function getConfig() {
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

	let config: Record<string, any> = {
		meta: {
			package: Constants.PACKAGE.name,
			version: Constants.PACKAGE.version,
			name: Constants.APP_NAME,
		},
	};
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
