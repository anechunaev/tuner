#!/usr/bin/env node

import { init, run } from "@tuner/core";
import classicUI from './classic';
import compactUI from './compact';
import dashboardUI from './dashboard';

let msgStart = ''; //"\x1b[2m";
let msgEnd = ''; //"\x1b[0m"
const wrappedLog = (...args: any[]) => console.log(`${msgStart}${args.map(e => e.toString()).join(' ')}${msgEnd}`);

const runner = init(wrappedLog);
const uiType = runner.context.config.ui;
const isCI = runner.context.config.ci;

if (!isCI) {
	msgStart = "\x1b[2m";
	msgEnd = "\x1b[0m"
}

let ui = classicUI;

switch(uiType) {
case "dashboard":
	ui = dashboardUI;
	break;
case "compact":
	ui = compactUI;
	break;
default:
	ui = classicUI;
}

ui(runner);

run(runner, wrappedLog);
