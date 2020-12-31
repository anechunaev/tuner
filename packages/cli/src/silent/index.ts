import { Runner } from '@tuner/core/lib/interfaces';
import { EventType } from '@tuner/core/lib/eventbus/constants'

function ui(runner: Runner) {
	runner.eventBus.on(EventType.EVENT_TASK_OUTPUT, (event) => {
		if (typeof event.data === "string") {
			console.log(event.data);
		}
	});
}

export default ui;
