import { Task } from '@tuner/core/lib/interfaces';
import { template as commandTemplate } from "./templates/command";
import { template as tunerTemplate } from "./templates/tuner";

export const name = "help";

export const description = {
	en: "Show command info",
	ru: "Показать информацию о команде",
};

export const task: Task = async ({ context }) => {
	if (typeof context.args._[1] === "string") {
		console.log(commandTemplate(context));
	} else {
		console.log(tunerTemplate(context));
	}
}
