import cp from 'child_process';
import * as Constant from './constants';

export function isWindows(): boolean {
	return Constant.PLATFORM === 'win32';
}

export function isMacOS(): boolean {
	return Constant.PLATFORM === 'darwin';
}

export function isLinux(): boolean {
	return Constant.PLATFORM !== 'win32' && Constant.PLATFORM !== 'darwin';
}

export function getExternalIPv4(): string[] {
	let ips: string[] = [];
	const interfaces = Object.keys(Constant.NETWORK);
	interfaces.forEach((ni) => {
		Constant.NETWORK[ni]?.forEach((net: any) => {
			if (!net.internal && net.family === 'IPv4') {
				ips.push(net.address);
			}
		});
	});

	return ips;
}

export function isCommandAvailable(cmd: string): Promise<boolean> {
	let searchCommand = 'whereis';

	if (isWindows()) {
		searchCommand = 'where';
	} else if (isMacOS()) {
		searchCommand = 'which';
	}

	return new Promise((resolve) => {
		const proc = cp.exec(`${searchCommand} ${cmd}`, (error) => {
			if (error || proc.exitCode !== 0) {
				return resolve(false);
			}

			return resolve(true);
		});
	});
}
