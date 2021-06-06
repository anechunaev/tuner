import { Context, Plugin } from "../interfaces";

export function loadPlugins(context: Context) {
	context.plugins = context.config.plugins.map((plugin: string) => require(plugin));
}

export function runPluginHandler(handler: keyof Plugin, context: Context) {
	async function walker(pluginList: Plugin[]) {
		if (pluginList.length > 0) {
			const currentPlugin = pluginList.shift()!;

			await new Promise<void>((resolve, reject) => {
				try {
					if (typeof currentPlugin[handler] === "function") {
						currentPlugin[handler]!(context);
						resolve();
					}
				} catch (pluginError) {
					reject(pluginError);
				}
			});
			walker(pluginList);
		}
	}

	if (Array.isArray(context.plugins) && context.plugins.length > 0) {
		walker([...context.plugins]);
	}
}
