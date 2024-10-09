#!/usr/bin/env node

import { init } from "@tuner/core";
// import { init, run } from "@tuner/core";
type Args = any;
// import classicUI from './classic';
import parseArgs from 'minimist';

const args: Args = parseArgs(process.argv.slice(2)) as Args;
// const cmd = args._[0];

const runner = init(args);
console.dir(runner.context.config, { depth: null });

// classicUI(runner);

// run(cmd, runner);
