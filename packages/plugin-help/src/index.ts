import { Context } from "@tuner/core/lib/interfaces";

export function commandStart(context: Context) {
	if (context.args.help || context.args.h) {
		context.cmd = "help";
		context.args._.unshift("help");
	}
}
