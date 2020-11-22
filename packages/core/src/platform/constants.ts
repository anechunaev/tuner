import os from 'os';

export const PLATFORM = os.platform();
export const TEMP_DIR = os.tmpdir();
export const HOME_DIR = os.homedir();
export const NETWORK = os.networkInterfaces();
