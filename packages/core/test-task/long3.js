function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}


module.exports = {
	task: () => {
		sleep(7000);
		console.log('=======> Long tas 3 ended');
	},
	description: {
		en: "Testing long execution",
		ru: "Проверка долгого выполнения",
	}
}
