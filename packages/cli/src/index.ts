#!/usr/bin/env node

import { init, run } from "@tuner/core";
import { Args } from "@tuner/core/lib/interfaces";
import classicUI from './classic';
import compactUI from './compact';
import dashboardUI from './dashboard';
import silentUI from './silent';
import parseArgs from 'minimist';

const args: Args = parseArgs(process.argv.slice(2)) as Args;
const cmd = args._[0];

const runner = init(args);
const uiType = runner.context.config.ui;

let ui = classicUI;

switch(uiType) {
case "dashboard":
	ui = dashboardUI;
	break;
case "compact":
	ui = compactUI;
	break;
case "silent":
	ui = silentUI;
	break;
default:
	ui = classicUI;
}

ui(runner);

run(cmd || "help", runner);
