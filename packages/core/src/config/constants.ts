import path from 'path';
import os from 'os';

const HOME_DIR = os.homedir();

export const PACKAGE = require(path.resolve(__dirname, '../../package.json'));

export const APP_NAME = "tuner";

export const APP_CONFIG_EXTENSIONS = [
	'.js', '.json', '.yaml', '.yml',
];

export const APP_CONFIG_SUB_PATHS = [
	`.${APP_NAME}/config`,
	`.${APP_NAME}/${APP_NAME}.config`,
	`${APP_NAME}.config`,
	`.${APP_NAME}rc`,
	`${APP_NAME}rc`,
];
export const CONFIG_FILE_NAMES = APP_CONFIG_EXTENSIONS.reduce<string[]>((list, ext) => {
	APP_CONFIG_SUB_PATHS.forEach(subpath => list.push(subpath + ext));
	return list;
}, []);

export const DEFAULT_CONFIG_PATH = path.resolve(__dirname, `../../${APP_NAME}.config.js`);

export const PATHS_TO_SEARCH: string[] = [
	process.cwd(),
	HOME_DIR,
];
